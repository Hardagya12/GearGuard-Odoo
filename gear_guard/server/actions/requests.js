
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Create a new maintenance request
 * @param {Object} data 
 */
export async function createRequest(data) {
  try {
    // 1. Fetch Equipment Details (if team/technician not manually provided)
    // The Auto-fill logic can happen here if frontend sends only equipmentId
    let { teamId } = data;
    
    if (!teamId && data.equipmentId) {
       const equipment = await prisma.equipment.findUnique({
           where: { id: data.equipmentId },
           select: { maintenanceTeamId: true }
       });
       if (equipment) teamId = equipment.maintenanceTeamId;
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        subject: data.subject,
        description: data.description,
        type: data.type,
        priority: data.priority || 'MEDIUM',
        stage: 'NEW',
        equipmentId: data.equipmentId,
        teamId: teamId,
        technicianId: data.technicianId,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      },
    });

    revalidatePath('/maintenance');
    return { success: true, data: request };
  } catch (error) {
    console.error('Failed to create request:', error);
    return { success: false, error: 'Failed to create maintenance request' };
  }
}

/**
 * Get Requests (Supports Kanban grouping or filters)
 */
export async function getRequests(filters = {}) {
    try {
        const where = {};
        if (filters.type) where.type = filters.type;
        if (filters.stage) where.stage = filters.stage;
        if (filters.teamId) where.teamId = filters.teamId;

        // Date range for Calendar
        if (filters.startDate && filters.endDate) {
            where.scheduledDate = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }

        const requests = await prisma.maintenanceRequest.findMany({
            where,
            include: {
                equipment: { select: { name: true, serialNumber: true } },
                team: { select: { name: true } },
                technician: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: requests };
    } catch (error) {
        console.error('Failed to get requests:', error);
        return { success: false, error: 'Failed to fetch requests' };
    }
}

/**
 * Update request status (e.g. Drag & Drop on Kanban)
 */
export async function updateRequestStage(id, stage) {
    try {
        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: { 
                stage, 
                updatedAt: new Date() 
            },
        });
        
        // If stage is SCRAP, update Equipment Status to SCRAPPED
        if (stage === 'SCRAP') {
            await prisma.equipment.update({
                where: { id: request.equipmentId }, // Need to fetch equipmentId first? update() returns the updated record so it's too late if we need 'select' but update() takes 'where'
                                                    // wait, request object returned by prisma.update includes all scalars by default, so equipmentId IS there.
                data: { status: 'SCRAPPED' }
            });
        }
        
        revalidatePath('/maintenance');
        revalidatePath('/equipment'); // Revalidate equipment list too
        return { success: true, data: request };
    } catch (error) {
        console.error('Failed to update request stage:', error);
        return { success: false, error: 'Failed to update request stage' };
    }
}

/**
 * Get Dashboard Statistics
 */
export async function getDashboardStats() {
  try {
    const [teamData, typeData] = await Promise.all([
      // 1. Group by Team
      prisma.maintenanceRequest.groupBy({
        by: ['teamId'],
        _count: {
          id: true
        },
        where: { stage: { not: 'REPAIRED' } } // Only active items
      }),

      // 2. Group by Type (Preventive vs Corrective)
      prisma.maintenanceRequest.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      })
    ]);

    // Fetch team names manually because groupBy doesn't support relation includes
    const teamIds = teamData.map(t => t.teamId).filter(Boolean);
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true, name: true }
    });

    // Format Team Data
    const formattedTeamData = teamData.map(t => {
      const team = teams.find(tm => tm.id === t.teamId);
      return {
        name: team ? team.name : 'Unassigned',
        count: t._count.id
      };
    });

    // Format Type Data
    const formattedTypeData = typeData.map(t => ({
      name: t.type,
      value: t._count.id
    }));

    return { 
      success: true, 
      data: {
        teamStats: formattedTeamData,
        typeStats: formattedTypeData
      }
    };

  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return { success: false, error: 'Failed' };
  }
}
