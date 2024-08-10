import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.model';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({
    type: String,
  })
  customerName: string;

  @Prop({
    type: String,
  })
  customerMobile: string;

  @Prop({
    type: Number,
  })
  totalPrice: number;

  @Prop({
    type: [OrderItemSchema],
  })
  orderItems: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
