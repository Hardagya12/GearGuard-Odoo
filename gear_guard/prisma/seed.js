
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Teams
  const mechanics = await prisma.team.upsert({
    where: { name: 'Mechanics' },
    update: {},
    create: { name: 'Mechanics' },
  });

  const itSupport = await prisma.team.upsert({
    where: { name: 'IT Support' },
    update: {},
    create: { name: 'IT Support' },
  });

  // Create Users (Technicians)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@gearguard.com' },
    update: {},
    create: {
      email: 'alice@gearguard.com',
      name: 'Alice Johnson',
      role: 'TECHNICIAN',
      teamId: mechanics.id,
    },
  });

  const bobert = await prisma.user.upsert({
    where: { email: 'bob@gearguard.com' },
    update: {},
    create: {
      email: 'bob@gearguard.com',
      name: 'Bob Smith',
      role: 'TECHNICIAN',
      teamId: mechanics.id,
    },
  });

  const eve = await prisma.user.upsert({
    where: { email: 'eve@gearguard.com' },
    update: {},
    create: {
      email: 'eve@gearguard.com',
      name: 'Eve Operator',
      role: 'TECHNICIAN',
      teamId: itSupport.id,
    },
  });

  // Create Equipment
  const cnc = await prisma.equipment.upsert({
    where: { serialNumber: 'CNC-2024-001' },
    update: {},
    create: {
      name: 'CNC Machine X1',
      serialNumber: 'CNC-2024-001',
      department: 'Production',
      location: 'Floor 1, Zone A',
      status: 'ACTIVE',
      maintenanceTeamId: mechanics.id,
    },
  });

  const printer = await prisma.equipment.upsert({
    where: { serialNumber: 'PRT-999-X' },
    update: {},
    create: {
      name: 'Office Printer P-500',
      serialNumber: 'PRT-999-X',
      department: 'HR',
      location: 'HR Office',
      status: 'ACTIVE',
      maintenanceTeamId: itSupport.id,
    },
  });

  // Create Requests
  await prisma.maintenanceRequest.create({
    data: {
      subject: 'Leaking Oil',
      type: 'CORRECTIVE',
      priority: 'HIGH',
      stage: 'IN_PROGRESS',
      equipmentId: cnc.id,
      teamId: mechanics.id,
      technicianId: alice.id,
      description: 'Oil leak detected near the hydraulic pump.',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
