import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WishlistModule } from './wishlist/wishlist.module';
import { SizesModule } from './sizes/sizes.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './category/category.module';
import { SubCategoryService } from './sub-category/sub-category.service';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Указываем корневой путь для сервировки статических файлов
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
    ProductModule,
    UploadModule,
    CartModule,
    UserModule,
    AuthModule,
    WishlistModule,
    SizesModule,
    CategoryModule,
    SubCategoryModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ProductService,
    SubCategoryService,
  ],
})
export class AppModule {}
