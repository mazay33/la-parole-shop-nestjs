// product.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { ProductConfigurationDto } from './dto/product-configuration.dto';
import { PrismaService } from '../prisma/prisma.service';


jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  unlink: jest.fn((path, callback) => callback(null)), // Simulate successful unlink
}));

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;
  let cacheManager: any;

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    productConfiguration: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productImage: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return cached data if exists', async () => {
      const cachedData = { data: [], total: 0 };
      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getProducts();
      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(prisma.product.count).not.toHaveBeenCalled();
    });

    it('should query database and cache result when no cache', async () => {
      const mockProducts = [{ id: 1, name: 'Test' }];
      const mockCount = 1;

      mockCacheManager.get.mockResolvedValue(null);
      mockPrisma.product.count.mockResolvedValue(mockCount);
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.getProducts(1, 10);

      expect(result).toEqual({
        data: mockProducts,
        total: mockCount,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null);

      await expect(service.getProductById(1)).rejects.toThrow(NotFoundException);
    });

    it('should return product if exists', async () => {
      const mockProduct = { id: 1, name: 'Test' };
      mockPrisma.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    const createDto: CreateProductDto = {
      name: 'New Product',
      sku: 'UNIQUE123',
      price: 100,
      categoryId: 1,
      subCategoryIds: [1],
      beltSizes: [],
      clothingSizes: [],
      cupSizes: [],
      isAvailable: true,
      discount: 0,
      stock: 10,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw ConflictException for duplicate SKU', async () => {
      mockPrisma.product.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.createProduct(createDto)).rejects.toThrow(`Product with SKU ${createDto.sku} already exists`);
    });

    it('should create product with valid data', async () => {
      const createdProduct = { id: 1, ...createDto };

      // Ensure findFirst returns null for the SKU check
      mockPrisma.product.findFirst.mockResolvedValue(null);
      mockPrisma.product.create.mockResolvedValue(createdProduct);

      const result = await service.createProduct(createDto);
      expect(result).toEqual(createdProduct);

      // Adjust the expected structure to include the 'data' key
      expect(mockPrisma.product.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          name: createDto.name,
          sku: createDto.sku,
          price: createDto.price,
          categoryId: createDto.categoryId,
          discount: createDto.discount,
          stock: createDto.stock,
          isAvailable: createDto.isAvailable,
          subCategories: {
            connect: [{ id: 1 }],
          },
          cupSizes: {
            connect: [],
          },
          clothingSizes: {
            connect: [],
          },
          beltSizes: {
            connect: [],
          },
        }),
      }));
    });
  });


  describe('productConfigurations', () => {
    const mockConfigDto: ProductConfigurationDto = {
      name: 'Config',
      sku: 'CONFIG123',
      price: 50,
    };

    it('should prevent duplicate configuration SKU', async () => {
      mockPrisma.productConfiguration.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.createProductConfiguration(1, mockConfigDto))
        .rejects.toThrow(ConflictException);
    });

    it('should update configuration', async () => {
      const existingConfig = { id: 1, productId: 1 };
      const updatedConfig = { ...existingConfig, ...mockConfigDto };

      mockPrisma.productConfiguration.findFirst.mockResolvedValue(existingConfig);
      mockPrisma.productConfiguration.update.mockResolvedValue(updatedConfig);

      const result = await service.updateProductConfiguration(1, 1, mockConfigDto);
      expect(result).toEqual(updatedConfig);
      expect(mockPrisma.productConfiguration.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...mockConfigDto,
          productId: 1,
        },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.deleteProduct(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete the product and return its id', async () => {
      const mockProduct = {
        id: 1,
        images: [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.productImage.deleteMany.mockResolvedValue({});
      mockPrisma.product.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct(1);
      expect(result).toEqual(mockProduct.id);
      expect(mockPrisma.productImage.deleteMany).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('replaceProductPhoto', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.replaceProductPhoto(1, 1, 'newImage.jpg')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if photo not found', async () => {
      const mockProduct = {
        id: 1,
        images: [{ id: 1, url: 'image1.jpg' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.replaceProductPhoto(1, 2, 'newImage.jpg')).rejects.toThrow(NotFoundException);
    });

    it('should replace the photo and return the updated product', async () => {
      const mockProduct = {
        id: 1,
        images: [{ id: 1, url: 'image1.jpg' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.productImage.update.mockResolvedValue({ id: 1, url: 'newImage.jpg' });
      mockPrisma.product.findUnique.mockResolvedValue({ ...mockProduct, images: [{ id: 1, url: 'newImage.jpg' }] });

      const result = await service.replaceProductPhoto(1, 1, 'newImage.jpg');
      expect(result.images[0].url).toEqual('newImage.jpg');
      expect(mockPrisma.productImage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { url: 'newImage.jpg' },
      });
    });
  });

  describe('deleteProductPhoto', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.deleteProductPhoto(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if photo not found', async () => {
      const mockProduct = {
        id: 1,
        images: [{ id: 1, url: 'image1.jpg' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.deleteProductPhoto(1, 2)).rejects.toThrow(NotFoundException);
    });


  });

  describe('deleteAllProductPhotos', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.deleteAllProductPhotos(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete all photos and return the updated product', async () => {
      const mockProduct = {
        id: 1,
        images: [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.productImage.deleteMany.mockResolvedValue({});
      mockPrisma.product.findUnique.mockResolvedValue({ ...mockProduct, images: [] });

      const result = await service.deleteAllProductPhotos(1);
      expect(result.images).toHaveLength(0);
      expect(mockPrisma.productImage.deleteMany).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
    });
  });
})

