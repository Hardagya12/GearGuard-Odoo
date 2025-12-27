const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting EXTENSIVE database seed...');
  
  // Delete existing data (fresh start)
  console.log('🗑️  Clearing existing data...');
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});
  console.log('✅ Cleared existing data');

  const password = await bcrypt.hash('password123', 10);

  // ========== CREATE TEAMS ==========
  const mechanics = await prisma.team.create({ data: { name: 'Mechanics' } });
  const itSupport = await prisma.team.create({ data: { name: 'IT Support' } });
  const electrical = await prisma.team.create({ data: { name: 'Electrical' } });
  const facility = await prisma.team.create({ data: { name: 'Facility' } });
  console.log('✅ Created 4 teams');

  // ========== CREATE USERS ==========
  const users = [];
  
  // Manager
  const admin = await prisma.user.create({
    data: { email: 'admin@gearguard.com', name: 'Admin Manager', password, role: 'MANAGER' }
  });
  users.push(admin);

  // Mechanics team (5 technicians)
  const mechanicsTechs = [
    { email: 'alice@gearguard.com', name: 'Alice Johnson' },
    { email: 'bob@gearguard.com', name: 'Bob Smith' },
    { email: 'carlos@gearguard.com', name: 'Carlos Rodriguez' },
    { email: 'diana@gearguard.com', name: 'Diana Martinez' },
    { email: 'frank@gearguard.com', name: 'Frank Wilson' }
  ];
  
  for (const tech of mechanicsTechs) {
    const user = await prisma.user.create({
      data: { ...tech, password, role: 'TECHNICIAN', teamId: mechanics.id }
    });
    users.push(user);
  }

  // IT Support team (4 technicians)
  const itTechs = [
    { email: 'eve@gearguard.com', name: 'Eve Operator' },
    { email: 'grace@gearguard.com', name: 'Grace Harper' },
    { email: 'henry@gearguard.com', name: 'Henry Chen' },
    { email: 'iris@gearguard.com', name: 'Iris Patel' }
  ];
  
  for (const tech of itTechs) {
    const user = await prisma.user.create({
      data: { ...tech, password, role: 'TECHNICIAN', teamId: itSupport.id }
    });
    users.push(user);
  }

  // Electrical team (3 technicians)
  const electricalTechs = [
    { email: 'charlie@gearguard.com', name: 'Charlie Spark' },
    { email: 'jade@gearguard.com', name: 'Jade Thompson' },
    { email: 'kyle@gearguard.com', name: 'Kyle Anderson' }
  ];
  
  for (const tech of electricalTechs) {
    const user = await prisma.user.create({
      data: { ...tech, password, role: 'TECHNICIAN', teamId: electrical.id }
    });
    users.push(user);
  }

  // Facility team (3 technicians)
  const facilityTechs = [
    { email: 'dave@gearguard.com', name: 'Dave Fixit' },
    { email: 'lisa@gearguard.com', name: 'Lisa Brown' },
    { email: 'mike@gearguard.com', name: 'Mike Taylor' }
  ];
  
  for (const tech of facilityTechs) {
    const user = await prisma.user.create({
      data: { ...tech, password, role: 'TECHNICIAN', teamId: facility.id }
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users (1 Manager + ${users.length - 1} Technicians)`);

  // ========== CREATE EQUIPMENT ==========
  const equipment = [];
  const departments = ['Production', 'Logistics', 'HR', 'IT', 'Sales', 'Warehousing', 'R&D'];
  const locations = ['Floor 1 - Zone A', 'Floor 1 - Zone B', 'Floor 2 - Zone C', 'Floor 3 - Office', 'Warehouse Bay 1', 'Warehouse Bay 2', 'Basement', 'Rooftop'];

  // Mechanics equipment (40 items)
  const mechanicsEquipment = [
    'CNC Machine', 'Forklift', 'Conveyor Belt', 'Injection Molder', 
    'Hydraulic Press', 'Lathe', 'Milling Machine', 'Grinder'
  ];
  
  for (let i = 1; i <= 40; i++) {
    const type = mechanicsEquipment[i % mechanicsEquipment.length];
    const eq = await prisma.equipment.create({
      data: {
        name: `${type} ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) || ''}`,
        serialNumber: `MECH-2024-${String(i).padStart(4, '0')}`,
        department: departments[i % departments.length],
        location: locations[i % locations.length],
        status: i % 15 === 0 ? 'UNDER_MAINTENANCE' : (i % 20 === 0 ? 'SCRAPPED' : 'ACTIVE'),
        maintenanceTeamId: mechanics.id,
        purchaseDate: new Date(2020 + (i % 5), Math.floor(Math.random() * 12), 1),
        warrantyExpiration: i % 3 === 0 ? new Date(2025 + (i % 3), 11, 31) : null,
        description: `${type} for ${departments[i % departments.length]} operations`
      }
    });
    equipment.push(eq);
  }

  // IT Support equipment (35 items)
  const itEquipment = [
    'Office Printer', 'Network Switch', 'Server Rack', 'Desktop Computer',
    'Laptop', 'Projector', 'Scanner', 'Router'
  ];
  
  for (let i = 1; i <= 35; i++) {
    const type = itEquipment[i % itEquipment.length];
    const eq = await prisma.equipment.create({
      data: {
        name: `${type} ${i < 10 ? 'P' : 'S'}-${i}00`,
        serialNumber: `IT-${String(i).padStart(3, '0')}-${String(2024 - (i % 3))}`,
        department: departments[(i + 2) % departments.length],
        location: locations[(i + 1) % locations.length],
        status: i % 12 === 0 ? 'UNDER_MAINTENANCE' : 'ACTIVE',
        maintenanceTeamId: itSupport.id,
        purchaseDate: new Date(2021 + (i % 4), (i * 2) % 12, 1),
        description: `${type} for office use`
      }
    });
    equipment.push(eq);
  }

  // Electrical equipment (15 items)
  const electricalEquipment = ['Generator', 'Transformer', 'Main Breaker', 'Lighting Panel', 'UPS'];
  
  for (let i = 1; i <= 15; i++) {
    const type = electricalEquipment[i % electricalEquipment.length];
    const eq = await prisma.equipment.create({
      data: {
        name: `${type} Unit ${i}`,
        serialNumber: `ELEC-2024-${String(i).padStart(3, '0')}`,
        department: 'Facilities',
        location: i % 2 === 0 ? 'Basement - Power Room' : 'Rooftop',
        status: i % 10 === 0 ? 'UNDER_MAINTENANCE' : 'ACTIVE',
        maintenanceTeamId: electrical.id,
        purchaseDate: new Date(2019 + (i % 6), 0, 1),
        warrantyExpiration: new Date(2026, 11, 31)
      }
    });
    equipment.push(eq);
  }

  // Facility equipment (20 items)
  const facilityEquipment = ['HVAC Unit', 'Automatic Door', 'Plumbing System', 'Fire Alarm', 'Security Camera'];
  
  for (let i = 1; i <= 20; i++) {
    const type = facilityEquipment[i % facilityEquipment.length];
    const eq = await prisma.equipment.create({
      data: {
        name: `${type} ${String.fromCharCode(65 + (i % 26))}`,
        serialNumber: `FAC-2024-${String(i).padStart(3, '0')}`,
        department: 'Building',
        location: `Floor ${(i % 3) + 1}`,
        status: i % 8 === 0 ? 'UNDER_MAINTENANCE' : 'ACTIVE',
        maintenanceTeamId: facility.id,
        description: `Building ${type.toLowerCase()}`
      }
    });
    equipment.push(eq);
  }

  console.log(`✅ Created ${equipment.length} equipment items`);

  // ========== CREATE MAINTENANCE REQUESTS ==========
  let requestCount = 0;
  
  const correctiveIssues = [
    'Oil leak detected', 'Strange noise during operation', 'Not starting', 
    'Overheating', 'Error code displayed', 'Component failure', 
    'Power loss', 'Network connectivity issue', 'Screen malfunction',
    'Hydraulic pressure drop', 'Belt slipping', 'Motor failure'
  ];
  
  const preventiveIssues = [
    'Scheduled maintenance check', 'Filter replacement', 'Oil change',
    'Firmware update', 'Safety inspection', 'Calibration required',
    'Quarterly service', 'Annual inspection', 'System cleaning'
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const stages = ['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP'];

  // Helper to get random technician from team
  const getTech = (teamId) => {
    const teamTechs = users.filter(u => u.teamId === teamId && u.role === 'TECHNICIAN');
    return teamTechs[Math.floor(Math.random() * teamTechs.length)];
  };

  // Create NEW requests (30)
  for (let i = 0; i < 30; i++) {
    const eq = equipment[Math.floor(Math.random() * equipment.length)];
    const tech = getTech(eq.maintenanceTeamId);
    const isPreventive = i % 3 === 0;
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: isPreventive 
          ? preventiveIssues[Math.floor(Math.random() * preventiveIssues.length)]
          : correctiveIssues[Math.floor(Math.random() * correctiveIssues.length)],
        description: `Requires attention. Equipment: ${eq.name}`,
        type: isPreventive ? 'PREVENTIVE' : 'CORRECTIVE',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        stage: 'NEW',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: i % 2 === 0 ? tech.id : null,
        scheduledDate: new Date(Date.now() + (Math.random() * 7) * 24 * 60 * 60 * 1000) // Next 7 days
      }
    });
    requestCount++;
  }

  // Create IN_PROGRESS requests (25)
  for (let i = 0; i < 25; i++) {
    const eq = equipment[Math.floor(Math.random() * equipment.length)];
    const tech = getTech(eq.maintenanceTeamId);
    const startDate = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000); // Started 0-3 days ago
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: correctiveIssues[Math.floor(Math.random() * correctiveIssues.length)],
        description: 'Work in progress',
        type: 'CORRECTIVE',
        priority: priorities[1 + Math.floor(Math.random() * 3)], // MEDIUM to CRITICAL
        stage: 'IN_PROGRESS',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: tech.id,
        scheduledDate: startDate,
        startedAt: startDate,
        durationHours: Math.round(Math.random() * 5 * 10) / 10
      }
    });
    requestCount++;
  }

  // Create REPAIRED requests (80 - historical data)
  for (let i = 0; i < 80; i++) {
    const eq = equipment[Math.floor(Math.random() * equipment.length)];
    const tech = getTech(eq.maintenanceTeamId);
    const daysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
    const scheduledDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const startedDate = new Date(scheduledDate.getTime() + Math.random() * 2 * 60 * 60 * 1000); // Started 0-2 hours after scheduled
    const completedDate = new Date(startedDate.getTime() + (1 + Math.random() * 8) * 60 * 60 * 1000); // Completed 1-8 hours after start
    const isPreventive = i % 4 === 0;
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: isPreventive 
          ? preventiveIssues[Math.floor(Math.random() * preventiveIssues.length)]
          : correctiveIssues[Math.floor(Math.random() * correctiveIssues.length)],
        description: 'Completed successfully',
        type: isPreventive ? 'PREVENTIVE' : 'CORRECTIVE',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        stage: 'REPAIRED',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: tech.id,
        scheduledDate,
        startedAt: startedDate,
        completedAt: completedDate,
        durationHours: Math.round((completedDate - startedDate) / (1000 * 60 * 60) * 10) / 10,
        createdAt: new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000) // Created 1 day before scheduled
      }
    });
    requestCount++;
  }

  // Create SCRAP requests (5 - equipment beyond repair)
  for (let i = 0; i < 5; i++) {
    const scrappedEq = equipment.filter(e => e.status === 'SCRAPPED');
    if (scrappedEq.length === 0) break;
    
    const eq = scrappedEq[i % scrappedEq.length];
    const tech = getTech(eq.maintenanceTeamId);
    const daysAgo = Math.floor(Math.random() * 30);
    const scheduledDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: 'Irreparable damage - equipment scrapped',
        description: 'Equipment beyond economical repair',
        type: 'CORRECTIVE',
        priority: 'CRITICAL',
        stage: 'SCRAP',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: tech.id,
        scheduledDate,
        startedAt: scheduledDate,
        createdAt: new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000)
      }
    });
    requestCount++;
  }

  // Create future PREVENTIVE requests for calendar (40)
  for (let i = 0; i < 40; i++) {
    const eq = equipment.filter(e => e.status === 'ACTIVE')[Math.floor(Math.random() * equipment.filter(e => e.status === 'ACTIVE').length)];
    const tech = getTech(eq.maintenanceTeamId);
    const futureDays = Math.floor(Math.random() * 60) + 1; // 1-60 days in future
    const futureDate = new Date(Date.now() + futureDays * 24 * 60 * 60 * 1000);
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: preventiveIssues[Math.floor(Math.random() * preventiveIssues.length)],
        description: 'Scheduled preventive maintenance',
        type: 'PREVENTIVE',
        priority: i % 5 === 0 ? 'HIGH' : 'MEDIUM',
        stage: 'NEW',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: i % 3 === 0 ? tech.id : null,
        scheduledDate: futureDate
      }
    });
    requestCount++;
  }

  // Create some OVERDUE requests (10)
  for (let i = 0; i < 10; i++) {
    const eq = equipment[Math.floor(Math.random() * equipment.length)];
    const tech = getTech(eq.maintenanceTeamId);
    const pastDays = Math.floor(Math.random() * 7) + 1; // 1-7 days overdue
    const pastDate = new Date(Date.now() - pastDays * 24 * 60 * 60 * 1000);
    
    await prisma.maintenanceRequest.create({
      data: {
        subject: `OVERDUE: ${correctiveIssues[Math.floor(Math.random() * correctiveIssues.length)]}`,
        description: 'Attention required - overdue',
        type: 'CORRECTIVE',
        priority: i % 2 === 0 ? 'HIGH' : 'CRITICAL',
        stage: i % 3 === 0 ? 'IN_PROGRESS' : 'NEW',
        equipmentId: eq.id,
        teamId: eq.maintenanceTeamId,
        technicianId: tech.id,
        scheduledDate: pastDate,
        startedAt: i % 3 === 0 ? pastDate : null,
        durationHours: i % 3 === 0 ? Math.round(Math.random() * 2 * 10) / 10 : null
      }
    });
    requestCount++;
  }

  console.log(`✅ Created ${requestCount} maintenance requests`);
  console.log('\n🎉 EXTENSIVE seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Teams: 4`);
  console.log(`   - Users: ${users.length} (1 Manager + ${users.length - 1} Technicians)`);
  console.log(`   - Equipment: ${equipment.length} items`);
  console.log(`   - Requests: ${requestCount} total`);
  console.log(`     • NEW: 40 (30 current + 10 overdue)`);
  console.log(`     • IN_PROGRESS: 25`);
  console.log(`     • REPAIRED: 80 (historical)`);
  console.log(`     • SCRAP: 5`);
  console.log(`     • Future Preventive: 40`);
  console.log('\n🔑 Test Accounts (password: password123):');
  console.log('   Manager:');
  console.log('   - admin@gearguard.com');
  console.log('\n   Technicians (Mechanics):');
  console.log('   - alice@gearguard.com, bob@gearguard.com, carlos@gearguard.com');
  console.log('   - diana@gearguard.com, frank@gearguard.com');
  console.log('\n   Technicians (IT Support):');
  console.log('   - eve@gearguard.com, grace@gearguard.com, henry@gearguard.com, iris@gearguard.com');
  console.log('\n   Technicians (Electrical):');
  console.log('   - charlie@gearguard.com, jade@gearguard.com, kyle@gearguard.com');
  console.log('\n   Technicians (Facility):');
  console.log('   - dave@gearguard.com, lisa@gearguard.com, mike@gearguard.com\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
