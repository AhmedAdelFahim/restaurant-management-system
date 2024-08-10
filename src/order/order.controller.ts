import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { schema } from './order.schema';
import {
  IOrderCreation,
  IOrderDailyReport,
  IOrderList,
  IOrderUpdate,
} from './order.interface';
import { TransformInterceptor } from '../interceptors/interceptor';
import { OrderService } from './order.service';

@UseInterceptors(TransformInterceptor)
@Controller({
  path: 'orders',
})
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  async create(@Body(new JoiValidationPipe(schema.add)) body: IOrderCreation) {
    await this.orderService.create(body);
    return {
      message: 'Order created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(schema.edit)) body: IOrderUpdate,
  ) {
    await this.orderService.update(id, body);
    return {
      message: 'Order update successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  async getAll(@Body(new JoiValidationPipe(schema.list)) body: IOrderList) {
    const orders = await this.orderService.list(body);
    return {
      data: { orders },
      statusCode: HttpStatus.OK,
    };
  }

  @Get('daily-report')
  async generateDailyReport(
    @Body(new JoiValidationPipe(schema.generateDailyReport))
    body: IOrderDailyReport,
  ) {
    const order = await this.orderService.generateDailyReport(body);
    return {
      data: { order: order || {} },
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const order = await this.orderService.getOneByID(id);
    return {
      data: { order: order || {} },
      statusCode: HttpStatus.OK,
    };
  }
}
