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
import { GetCurrentUserId } from 'src/common/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';

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
    @GetCurrentUserId() userId: string,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() addProductToCartDto: AddProductToCartDto,
  ) {
    return this.cartService.addProductToCart(
      userId,
      productId,
      addProductToCartDto.count,
    );
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Product removed from cart' })
  async removeProductFromCart(
    @GetCurrentUserId() userId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeProductFromCart(userId, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  async clearCart(@GetCurrentUserId() userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved' })
  async getCart(@GetCurrentUserId() userId: string) {
    return this.cartService.getCart(userId);
  }
}
