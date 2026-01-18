import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const divisions = [
    'Dhaka',
    'Chattogram',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
    'Sylhet',
  ];

  for (const name of divisions) {
    await prisma.division.upsert({
      where: { name },
      update: {},
      create: { name, is_active: true },
    });
  }

  const dhaka = await prisma.division.findUnique({ where: { name: 'Dhaka' } });
  if (dhaka) {
    const district = await prisma.district.upsert({
      where: { id: 1 },
      update: {},
      create: { division_id: dhaka.id, name: 'Dhaka', is_active: true },
    });

    await prisma.upazila.upsert({
      where: { id: 1 },
      update: {},
      create: { district_id: district.id, name: 'Savar', is_active: true },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
