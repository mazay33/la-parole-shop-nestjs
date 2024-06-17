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

@ApiBearerAuth()
@ApiTags('Сart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/:productId')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiBody({ type: AddProductToCartDto })
  @ApiResponse({ status: 201, description: 'Product added to cart' })
  async addProductToCart(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() addProductToCartDto: AddProductToCartDto,
  ) {
    return this.cartService.addProductToCart(
      user.id,
      productId,
      addProductToCartDto.count,
    );
  }
  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Product removed from cart' })
  async removeProductFromCart(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeProductFromCart(user.id, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  async clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved' })
  async getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.id);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get total price of cart' })
  @ApiResponse({ status: 200, description: 'Cart total price retrieved' })
  async getCartTotal(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCartTotalPrice(user.id);
  }
}
