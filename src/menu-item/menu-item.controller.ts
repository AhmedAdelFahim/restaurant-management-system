import {
  Body,
  Controller,
  Get,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { schema } from './menu-item.schema';

import { TransformInterceptor } from '../interceptors/interceptor';
import { MenuItemService } from './menu-item.service';

@UseInterceptors(TransformInterceptor)
@Controller({
  path: 'menu-items',
})
export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  @Get()
  async getAll(@Body(new JoiValidationPipe(schema.list)) body: any) {
    const menu = await this.menuItemService.list(body);
    return {
      data: { menu },
      statusCode: HttpStatus.OK,
    };
  }
}
