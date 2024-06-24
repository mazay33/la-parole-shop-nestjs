import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from 'src/auth/interfaces';
import { Cart } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Корзина')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/:productId')
  @ApiOperation({ summary: 'Добавить продукт в корзину' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiBody({ type: AddProductToCartDto })
  @ApiResponse({ status: 201, description: 'Продукт добавлен в корзину' })
  async addProductToCart(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() addProductToCartDto: AddProductToCartDto,
  ) {
    return this.cartService.addProductToCart(
      user.id,
      productId,
      addProductToCartDto.quantity,
      addProductToCartDto.configurataionId,
      addProductToCartDto.beltSizeId,
      addProductToCartDto.clothingSizeId,
      addProductToCartDto.cupSizeId,
    );
  }

  @Delete('remove/:productCartId')
  @ApiOperation({ summary: 'Удалить продукт из корзины' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Продукт удален из корзины' })
  async removeProductFromCart(
    @CurrentUser() user: JwtPayload,
    @Param('productCartId', ParseIntPipe) productCartId: number,
  ) {
    return this.cartService.removeProductFromCart(user.id, productCartId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({ status: 200, description: 'Корзина очищена' })
  async clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить корзину' })
  @ApiResponse({ status: 200, description: 'Корзина получена' })
  async getCart(@CurrentUser() user: JwtPayload): Promise<Cart> {
    return this.cartService.getCart(user.id);
  }

  @Get('total')
  @ApiOperation({ summary: 'Получить общую стоимость корзины' })
  @ApiResponse({ status: 200, description: 'Общая стоимость корзины получена' })
  async getCartTotalPrice(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ totalPrice: number }> {
    const { totalPrice } = await this.cartService.getCartSummary(user.id);

    return { totalPrice };
  }

  @Get('quantity')
  @ApiOperation({ summary: 'Получить количество продуктов в корзине' })
  @ApiResponse({
    status: 200,
    description: 'Количество продуктов в корзине получено',
  })
  async getCartQuantity(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ totalQuantity: number }> {
    const { totalQuantity } = await this.cartService.getCartSummary(user.id);

    return { totalQuantity };
  }
}
