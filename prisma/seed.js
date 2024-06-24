const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Define your seed data
    const categories = [
      {
        name: 'Комплекты',
      },
      {
        name: 'Бюстгальтеры',
      },
      {
        name: 'Трусики',
      },
      {
        name: 'Аксессуары',
      },
    ];

    const subCategories = [
      {
        name: 'BESTSELLERS',
        categoryId: 1,
        description: '',
      },
      {
        name: 'БАЗОВЫЕ КОМПЛЕКТЫ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'КРУЖЕВНОЕ БЕЛЬЕ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'ЧЕРНОЕ БЕЛЬЕ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'ТЕЛЕСНОЕ БЕЛЬЕ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'НЕЖНОЕ БЕЛЬЕ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'КРАСНОЕ БЕЛЬЕ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'БЕЛЬЕ ДЛЯ СВИДАНИЙ',
        categoryId: 1,
        description: '',
      },
      {
        name: 'КЛАССИЧЕСКАЯ ЧАШКА',
        categoryId: 2,
        description: '',
      },
      {
        name: 'УКОРОЧЕННАЯ ЧАШКА',
        categoryId: 2,
        description: '',
      },
      {
        name: 'БАЛКОНЕТ',
        categoryId: 2,
        description: '',
      },
      {
        name: 'КОРСЕТ',
        categoryId: 2,
        description: '',
      },
      {
        name: 'СТРИНГИ',
        categoryId: 3,
        description: '',
      },
      {
        name: 'СТРИНГИ НА РЕГУЛЯТОРАХ',
        categoryId: 3,
        description: '',
      },
      {
        name: 'БРАЗИЛЬЯНО',
        categoryId: 3,
        description: '',
      },
      {
        name: 'БРАЗИЛЬЯНО НА РЕГУЛЯТОРАХ',
        categoryId: 3,
        description: '',
      },
      {
        name: 'ВЫСОКИЕ',
        categoryId: 3,
        description: '',
      },
      {
        name: 'КРУЖЕВНЫЕ',
        categoryId: 3,
        description: '',
      },
      {
        name: 'ПОЯСА',
        categoryId: 4,
        description: '',
      },
    ];

    const cupSizes = [
      { size: '70A' },
      { size: '70B' },
      { size: '70C' },
      { size: '70D' },

      { size: '75A' },
      { size: '75B' },
      { size: '75C' },
      { size: '75D' },

      { size: '80A' },
      { size: '80B' },
      { size: '80C' },
      { size: '80D' },

      { size: '85A' },
      { size: '85B' },
      { size: '85C' },
      { size: '85D' },
    ];

    const clothingSizes = [
      { size: 'XS' },
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
    ];

    const beltSizes = [
      { size: 'XS' },
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
    ];

    const existingCategories = await prisma.category.findMany();

    // Seed the users
    if (existingCategories.length === 0) {
      // Seed the categories
      for (const category of categories) {
        await prisma.category.create({
          data: category,
        });
      }
    }

    const existingSubCategories = await prisma.subCategory.findMany();

    // If subcategories exist, do not create them again
    if (existingSubCategories.length === 0) {
      // Seed the subcategories
      for (const subCategory of subCategories) {
        await prisma.subCategory.create({
          data: subCategory,
        });
      }
    }

    const existingCupSizes = await prisma.cupSize.findMany();

    if (existingCupSizes.length === 0) {
      for (const cupSize of cupSizes) {
        await prisma.cupSize.create({
          data: cupSize,
        });
      }
    }

    const existingClothingSizes = await prisma.clothingSize.findMany();

    if (existingClothingSizes.length === 0) {
      for (const clothingSize of clothingSizes) {
        await prisma.clothingSize.create({
          data: clothingSize,
        });
      }
    }

    const existingBeltSizes = await prisma.beltSize.findMany();

    if (existingBeltSizes.length === 0) {
      for (const beltSize of beltSizes) {
        await prisma.beltSize.create({
          data: beltSize,
        });
      }
    }

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
