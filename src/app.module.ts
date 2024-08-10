import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import configSchema from './config/config-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderModule } from './order/order.module';
import { RedisModule } from './caching/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.dbURL'),
        authSource: 'admin',
      }),
    }),
    RedisModule,
    MenuItemModule,
    OrderModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
