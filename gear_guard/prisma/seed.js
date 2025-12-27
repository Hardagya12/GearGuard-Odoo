
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Start seeding extensive data...');

  // --- CONSTANTS & HELPERS ---
  const DEPARTMENTS = ['Production', 'Logistics', 'HR', 'IT', 'Sales', 'Warehousing', 'R&D'];
  const LOCATIONS = ['Floor 1 - Zone A', 'Floor 1 - Zone B', 'Floor 2 - Server Room', 'Warehouse Bay 3', 'Office Block C', 'Lab 1'];
  
  const TEAMS_DATA = [
      { name: 'Mechanics', type: 'Heavy Machinery' },
      { name: 'IT Support', type: 'Computers & Networks' },
      { name: 'Electrical', type: 'Power & Wiring' },
      { name: 'Facility', type: 'Building Infrastructure' }
  ];

  const MACHINE_TYPES = {
      'Mechanics': ['CNC Machine', 'Forklift', 'Conveyor Belt', 'Injection Molder', 'Hydraulic Press'],
      'IT Support': ['Server Rack', 'Office Laptop', 'Network Switch', 'Printer', 'Projector'],
      'Electrical': ['Main Breaker', 'Generator', 'Transformer', 'Lighting Control Panel'],
      'Facility': ['HVAC Unit', 'Automatic Door', 'Plumbing System', 'Fire Alarm']
  };

  const ISSUES = {
      'CORRECTIVE': ['Not starting', 'Leaking fluid', 'Strange noise', 'Overheating', 'Error Code 505', 'Broken Screen', 'Power Failure'],
      'PREVENTIVE': ['Annual Service', 'Filter Change', 'Oil Change', 'Firmware Update', 'Safety Inspection', 'Calibration']
  };

  function random(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // --- 1. TEAMS ---
  const teams = {};
  for (const t of TEAMS_DATA) {
      teams[t.name] = await prisma.team.upsert({
          where: { name: t.name },
          update: {},
          create: { name: t.name },
      });
      console.log(`✅ Team: ${t.name}`);
  }

  // --- 2. USERS (Core + Random) ---
  const password = await bcrypt.hash('password123', 10);
  
  // Admin
  await prisma.user.upsert({
      where: { email: 'admin@gearguard.com' },
      update: { role: 'MANAGER', password },
      create: {
          email: 'admin@gearguard.com',
          name: 'Arthur Admin',
          role: 'MANAGER',
          password
      }
  });

  // Technicians
  const technicians = [];
  const techData = [
      { name: 'Alice Johnson', email: 'alice@gearguard.com', team: 'Mechanics' },
      { name: 'Bob Smith', email: 'bob@gearguard.com', team: 'Mechanics' },
      { name: 'Eve Operator', email: 'eve@gearguard.com', team: 'IT Support' },
      { name: 'Charlie Spark', email: 'charlie@gearguard.com', team: 'Electrical' },
      { name: 'Dave Fixit', email: 'dave@gearguard.com', team: 'Facility' },
      { name: 'Frank Net', email: 'frank@gearguard.com', team: 'IT Support' },
      { name: 'Grace Gears', email: 'grace@gearguard.com', team: 'Mechanics' }
  ];

  for (const t of techData) {
      const user = await prisma.user.upsert({
          where: { email: t.email },
          update: { teamId: teams[t.team].id, password },
          create: {
              email: t.email,
              name: t.name,
              role: 'TECHNICIAN',
              teamId: teams[t.team].id,
              password
          }
      });
      technicians.push(user);
  }
  console.log(`✅ Created ${technicians.length} Technicians`);


  // --- 3. EQUIPMENT & REQUESTS ---
  const equipmentList = [];
  let requestCount = 0;

  for (const [teamName, teamObj] of Object.entries(teams)) {
      // Generate 10-15 pieces of equipment per team
      const count = 10 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < count; i++) {
          const type = random(MACHINE_TYPES[teamName]);
          const serial = `${type.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`;
          
          const eq = await prisma.equipment.upsert({
              where: { serialNumber: serial },
              update: {},
              create: {
                  name: `${type} ${String.fromCharCode(65 + i)}${i+1}`,
                  serialNumber: serial,
                  department: random(DEPARTMENTS),
                  location: random(LOCATIONS),
                  status: Math.random() > 0.8 ? 'UNDER_MAINTENANCE' : 'ACTIVE',
                  maintenanceTeamId: teamObj.id,
                  purchaseDate: randomDate(new Date(2020, 0, 1), new Date()),
                  description: `Standard ${type} unit.`
              }
          });
          equipmentList.push(eq);

          // Generate Requests for this equipment
          // 1. Past Requests (Completed)
          const pastCount = Math.floor(Math.random() * 5);
          for (let k = 0; k < pastCount; k++) {
              const type = Math.random() > 0.6 ? 'PREVENTIVE' : 'CORRECTIVE';
              const tech = technicians.find(u => u.teamId === teamObj.id) || technicians[0];
              const date = randomDate(new Date(2023, 0, 1), new Date());
              
              await prisma.maintenanceRequest.create({
                  data: {
                      subject: `${random(ISSUES[type])} on ${eq.name}`,
                      type,
                      priority: random(['LOW', 'MEDIUM', 'HIGH']),
                      stage: 'REPAIRED',
                      equipmentId: eq.id,
                      teamId: teamObj.id,
                      technicianId: tech.id,
                      scheduledDate: date,
                      startedAt: date,
                      completedAt: new Date(date.getTime() + (Math.random() * 10 
 * 3600000)), // +random hours
                      durationHours: Math.round(Math.random() * 8 * 10) / 10,
                      createdAt: date
                  }
              });
              requestCount++;
          }

          // 2. Active Requests (New/In Progress)
          if (Math.random() > 0.7) {
              const type = 'CORRECTIVE';
              const tech = Math.random() > 0.3 ? (technicians.find(u => u.teamId === teamObj.id) || null) : null;
              
              await prisma.maintenanceRequest.create({
                  data: {
                      subject: `URGENT: ${random(ISSUES.CORRECTIVE)}`,
                      type,
                      priority: Math.random() > 0.5 ? 'CRITICAL' : 'HIGH',
                      stage: tech ? 'IN_PROGRESS' : 'NEW',
                      equipmentId: eq.id,
                      teamId: teamObj.id,
                      technicianId: tech?.id,
                      scheduledDate: new Date(),
                      description: 'Reported by floor manager. Please investigate immediately.'
                  }
              });
              requestCount++;
          }

          // 3. Future Preventive (Calendar)
          if (Math.random() > 0.5) {
               const date = randomDate(new Date(), new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)); // Next 30 days
               await prisma.maintenanceRequest.create({
                  data: {
                      subject: `Scheduled: ${random(ISSUES.PREVENTIVE)}`,
                      type: 'PREVENTIVE',
                      priority: 'MEDIUM',
                      stage: 'NEW',
                      equipmentId: eq.id,
                      teamId: teamObj.id,
                      scheduledDate: date,
                  }
              });
              requestCount++;
          }
      }
  }

  console.log(`✅ Created ${equipmentList.length} Equipment`);
  console.log(`✅ Created ${requestCount} Maintenance Requests`);
  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
