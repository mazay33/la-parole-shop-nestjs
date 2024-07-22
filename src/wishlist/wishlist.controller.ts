import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from 'src/auth/interfaces';

@ApiBearerAuth()
@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  async addProductTowishlist(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.addProductToWishlist(user.id, productId);
  }
  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async removeProductFromwishlist(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeProductFromWishlist(user.id, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear wishlist' })
  @ApiResponse({ status: 200, description: 'wishlist cleared' })
  async clearwishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.clearWishlist(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get wishlist' })
  @ApiResponse({ status: 200, description: 'wishlist retrieved' })
  async getwishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.getWishlist(user.id);
  }
}
