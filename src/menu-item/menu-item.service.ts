import { Injectable } from '@nestjs/common';
import { MenuItem } from './menu-item.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}
  async list(filter = { pageSize: 10, page: 1 }) {
    const offset = (filter.page - 1) * filter.pageSize;
    const orders = await this.menuItemModel
      .find({})
      .sort('-createdAt')
      .limit(filter.pageSize)
      .skip(offset);

    return orders;
  }
}
