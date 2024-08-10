import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './menu-item.model';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [MenuItemService],
  controllers: [MenuItemController],
})
export class MenuItemModule {}
