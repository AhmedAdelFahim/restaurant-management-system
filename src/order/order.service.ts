import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.model';
import { Model } from 'mongoose';
import { MenuItem } from '../menu-item/menu-item.model';
import {
  IOrderCreation,
  IOrderDailyReport,
  IOrderList,
} from './order.interface';
import moment from 'moment';
import { RedisService } from '../caching/redis.service';
import { BadRequestException } from 'unified-errors-handler';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
    private readonly redisService: RedisService,
  ) {}

  async prepareOrderForCreation(orderCreation: IOrderCreation) {
    const menuItems = await this.menuItemModel.find({
      _id: {
        $in: orderCreation.orderItems.map((item) => item.itemID),
      },
    });
    if (menuItems.length !== orderCreation.orderItems.length) {
      throw new BadRequestException({
        message: 'invalid order items',
        code: 'INVALID_ORDER_ITEMS',
      });
    }
    const mappedMenuItems = menuItems.reduce((acc, item) => {
      acc[item._id.toString()] = item;
      return acc;
    }, {});
    orderCreation.orderItems = orderCreation.orderItems.map((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.itemName = mappedMenuItems[item.itemID].itemName;
      newItem.itemPrice = mappedMenuItems[item.itemID].itemPrice;
      newItem.totalItemPrice =
        mappedMenuItems[item.itemID].itemPrice * item.quantity;
      return newItem;
    });
    const calculatedTotal = orderCreation.orderItems.reduce(
      (acc, item: any) => {
        acc += item.totalItemPrice;
        return acc;
      },
      0,
    );
    if (Math.abs(calculatedTotal - orderCreation.totalPrice) > 0.0000001) {
      throw new BadRequestException({
        message: 'invalid total price',
        code: 'INVALID_CALCULATION',
      });
    }
    return orderCreation;
  }

  async create(orderCreation: IOrderCreation) {
    const mappedOrderCreation =
      await this.prepareOrderForCreation(orderCreation);
    await this.orderModel.create(mappedOrderCreation);
  }

  async update(id: string, orderCreation: IOrderCreation) {
    const mappedOrderCreation =
      await this.prepareOrderForCreation(orderCreation);
    await this.orderModel.updateOne({ _id: id }, mappedOrderCreation);
  }

  async list(filter: IOrderList = { pageSize: 10, page: 1 }) {
    const offset = (filter.page - 1) * filter.pageSize;
    const orders = await this.orderModel
      .find({})
      .sort('-createdAt')
      .limit(filter.pageSize)
      .skip(offset);

    return orders;
  }

  async getOneByID(id: string) {
    const order = await this.orderModel.findOne({ _id: id });
    return order;
  }

  getDailyReportKey(date: string) {
    return `order:daily_report:${date}`;
  }
  async generateDailyReportFromRedis(date: string) {
    const key = this.getDailyReportKey(date);
    const report = await this.redisService.getKey(key);
    const reportObj = JSON.parse(report);
    Logger.debug(`generateDailyReportFromRedis: day: ${date}`);
    return reportObj;
  }

  async setDailyReportInRedis(date: string, report) {
    const key = this.getDailyReportKey(date);
    const reportStr = JSON.stringify(report);
    await this.redisService.setKey(key, reportStr, { ttl: 604800 }); // one week
  }

  async generateDailyReportFromDB(start: string, end: string) {
    let ordersForDailyReport = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gt: new Date(start),
            $lt: new Date(end),
          },
        },
      },
      {
        $project: {
          totalPrice: 1,
          orderItems: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          numOfOrders: { $count: {} },
          items: { $push: '$orderItems' },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          numOfOrders: 1,
          items: {
            $reduce: {
              input: '$items',
              initialValue: [],
              in: {
                $concatArrays: ['$$value', '$$this'],
              },
            },
          },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            totalRevenue: '$totalRevenue',
            numOfOrders: '$numOfOrders',
            itemID: '$items.itemID',
          },
          totalSold: { $sum: '$items.quantity' },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 2,
      },
    ]);
    ordersForDailyReport = await this.orderModel.populate(
      ordersForDailyReport,
      { path: '_id.itemID', model: this.menuItemModel },
    );
    ordersForDailyReport = ordersForDailyReport.reduce(
      (acc, item) => {
        acc.day = start;
        acc.totalRevenue = item._id.totalRevenue;
        acc.numOfOrders = item._id.numOfOrders;
        acc.topSoldItems.push({
          itemName: item._id.itemID.itemName,
          totalSold: item.totalSold,
        });
        return acc;
      },
      { topSoldItems: [] },
    );
    Logger.debug(`generateDailyReportFromDB: day: ${start}`);
    return ordersForDailyReport;
  }

  async generateDailyReport({ day, timezoneOffset }: IOrderDailyReport) {
    const start = moment(day)
      .utcOffset(timezoneOffset)
      .format('YYYY-MM-DDT00:00:00Z');
    const end = moment(day)
      .utcOffset(timezoneOffset)
      .format('YYYY-MM-DDT23:59:59Z');
    let ordersForDailyReport = await this.generateDailyReportFromRedis(start);
    if (ordersForDailyReport) {
      return ordersForDailyReport;
    } else {
      ordersForDailyReport = await this.generateDailyReportFromDB(start, end);
      await this.setDailyReportInRedis(start, ordersForDailyReport);
    }
    return ordersForDailyReport;
  }
}
