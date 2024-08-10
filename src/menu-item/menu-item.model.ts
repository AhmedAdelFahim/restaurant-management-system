import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({
  timestamps: true,
})
export class MenuItem {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  itemName: string;

  @Prop({
    type: Number,
    required: true,
  })
  itemPrice: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
