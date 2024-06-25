import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSizesList() {
    const bustSizes = await this.prisma.cupSize.findMany({
      select: {
        id: true,
        size: true,
      },
    });

    const clothingSizes = await this.prisma.clothingSize.findMany({
      select: {
        id: true,
        size: true,
      },
    });

    const beltSizes = await this.prisma.beltSize.findMany({
      select: {
        id: true,
        size: true,
      },
    });

    return { bustSizes, clothingSizes, beltSizes };
  }
}
