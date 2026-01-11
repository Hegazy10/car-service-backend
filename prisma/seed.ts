import { PrismaClient, UserRole, ServiceCategory } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables so process.env.DATABASE_URL is available
dotenv.config();

// 1. Setup the connection pool and adapter
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // --- Admin User ---
  const adminEmail = 'admin@carservice.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'System Administrator',
        role: UserRole.ADMIN,
      },
    });
    console.log('✅ Admin user created: admin@carservice.com / Admin123!');
  }

  // --- Car Brands ---
  const brands = [
    { name: 'Toyota', models: ['Corolla', 'Camry', 'Land Cruiser'] },
    { name: 'BMW', models: ['3 Series', '5 Series', 'X5'] },
    { name: 'Mercedes', models: ['C-Class', 'E-Class', 'G-Class'] },
  ];

  for (const b of brands) {
    const brand = await prisma.carBrand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name },
    });

    for (const m of b.models) {
      const existingModel = await prisma.carModel.findFirst({
        where: { name: m, brandId: brand.id },
      });

      if (!existingModel) {
        await prisma.carModel.create({
          data: { name: m, brandId: brand.id },
        });
      }
    }
  }
  console.log('✅ Car Brands & Models seeded');

  // --- Services ---
  const services = [
    {
      name: 'Synthetic Oil Change',
      category: ServiceCategory.OIL,
      price: 50.0,
    },
    {
      name: 'Brake Pad Replacement',
      category: ServiceCategory.OTHER,
      price: 120.0,
    },
    {
      name: 'Battery Check & Replace',
      category: ServiceCategory.BATTERY,
      price: 85.0,
    },
  ];

  for (const s of services) {
    const existingService = await prisma.service.findFirst({
      where: { name: s.name },
    });

    if (!existingService) {
      await prisma.service.create({
        data: {
          name: s.name,
          category: s.category,
          basePrice: s.price,
          description: 'Standard maintenance service',
        },
      });
    }
  }
  console.log('✅ Basic Services seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
