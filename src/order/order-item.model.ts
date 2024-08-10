import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({
  timestamps: true,
})
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menuitems',
  })
  itemID: string;

  @Prop({
    type: String,
  })
  itemName: string;

  @Prop({
    type: Number,
  })
  itemPrice: number;

  @Prop({
    type: Number,
  })
  totalItemPrice: number;

  @Prop({
    type: Number,
  })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
