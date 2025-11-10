import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.inquiry.deleteMany();
  await prisma.sword.deleteMany();

  // Create sample swords
  const swords = await Promise.all([
    prisma.sword.create({
      data: {
        category: 'KATANA',
        name: 'Masamune Katana',
        nameJapanese: '正宗刀',
        description: 'A masterpiece from the legendary swordsmith Masamune. Known for its exceptional sharpness and beautiful hamon pattern.',
        price: 25000.00,
        craftsman: 'Gorō Nyūdō Masamune',
        era: 'Kamakura Period',
        image: '/images/masamune-katana.jpg',
        available: true,
        specifications: {
          steelType: 'Tamahagane',
          pattern: 'Notare-midare',
          polisher: 'Honami School',
          length: 73.5,
          weight: 1.2,
          features: [
            'Notare-midare hamon pattern',
            'Honami school polishing',
            'Original Edo period koshirae',
            'NBTHK Juyo Token certification'
          ]
        }
      },
    }),
    prisma.sword.create({
      data: {
        category: 'WAKIZASHI',
        name: 'Muramasa Wakizashi',
        nameJapanese: '村正脇差',
        description: 'A companion sword by the famous Muramasa school. Known for its aggressive cutting ability and distinctive koshirae.',
        price: 15000.00,
        craftsman: 'Sengo Muramasa',
        era: 'Muromachi Period',
        image: '/images/muramasa-wakizashi.jpg',
        available: true,
        specifications: {
          steelType: 'Tamahagane',
          pattern: 'Gunome-midare',
          polisher: 'Fujishiro School',
          length: 52.0,
          weight: 0.9,
          features: [
            'Gunome-midare hamon pattern',
            'Fujishiro school polishing',
            'Custom crafted Edo period mountings',
            'Historical documentation included'
          ]
        }
      },
    }),
    prisma.sword.create({
      data: {
        category: 'TANTO',
        name: 'Kunimitsu Tanto',
        nameJapanese: '国光短刀',
        description: 'An elegant tanto from the Soshu tradition. Perfect balance of form and function with exquisite koshirae.',
        price: 8000.00,
        craftsman: 'Awataguchi Kunimitsu',
        era: 'Kamakura Period',
        image: '/images/kunimitsu-tanto.jpg',
        available: true,
        specifications: {
          steelType: 'Tamahagane',
          pattern: 'Suguha',
          polisher: 'Nagayama School',
          length: 29.7,
          weight: 0.4,
          features: [
            'Suguha hamon pattern',
            'Nagayama school polishing',
            'Shirasaya storage mount',
            'Museum-grade preservation'
          ]
        }
      },
    }),
  ]);

  console.log('Database seeded successfully');
  console.log('Created swords:', swords);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });