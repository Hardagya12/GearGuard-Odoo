
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

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

    // Send Email Notification if technician is assigned
    if (data.technicianId) {
        const technician = await prisma.user.findUnique({
            where: { id: data.technicianId },
            select: { email: true, name: true }
        });

        if (technician && technician.email) {
            await sendEmail({
                to: technician.email,
                subject: `🔧 New Maintenance Request: ${data.subject}`,
                html: `
                    <h2>Hello ${technician.name},</h2>
                    <p>You have been assigned a new maintenance request.</p>
                    <p><strong>Subject:</strong> ${data.subject}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Priority:</strong> ${data.priority || 'MEDIUM'}</p>
                    <br/>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/maintenance">View Dashboard</a>
                `
            });
        }
    }

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
import { getSession } from './auth';

/**
 * Get Requests (Supports Kanban grouping or filters)
 */
export async function getRequests(filters = {}) {
    try {
        const session = await getSession();
        const where = {};

        // Role-Based Filtering
        if (session && session.role === 'TECHNICIAN') {
            // Technician can only see requests assigned to their team or assigned to them explicitly
            const user = await prisma.user.findUnique({
                where: { id: session.id },
                select: { teamId: true }
            });

            // If user has a team, show team requests + personal assignments
            // If user has no team, just personal assignments
            if (user?.teamId) {
                where.OR = [
                    { teamId: user.teamId },
                    { technicianId: session.id }
                ];
            } else {
                where.technicianId = session.id;
            }
        }
        
        // --- Standard Filters ---
        if (filters.type) where.type = filters.type;
        if (filters.stage) where.stage = filters.stage;
        
        // If manager filters by team specifically, respect that (unless already restricted above? No, technician can't filter by team via UI easily if strictly enforced here)
        // But if filtering API is used:
        if (filters.teamId) {
             // If technician tries to filter by another team, overriding their restriction:
             // We should AND it.
             // But for simplicity, let's assume UI handles the "which team to pick" and here we enforce security.
             where.teamId = filters.teamId;
        }

        if (filters.equipmentId) {
            where.equipmentId = filters.equipmentId;
        }

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
        const session = await getSession();
        if (!session) return { success: false, error: 'Unauthorized' };

        // If Technician, verify ownership
        if (session.role === 'TECHNICIAN') {
             const user = await prisma.user.findUnique({ where: { id: session.id } });
             const request = await prisma.maintenanceRequest.findUnique({ where: { id } });
             
             if (!request) return { success: false, error: 'Request not found' };
             
             // Check if assigned to technician OR technician's team
             const isAssigned = request.technicianId === session.id;
             const isTeamAssigned = user?.teamId && request.teamId === user.teamId;

             if (!isAssigned && !isTeamAssigned) {
                 return { success: false, error: 'Unauthorized: You can only update requests assigned to you or your team' };
             }
        }

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
 * Update request duration
 */
export async function updateRequestDuration(id, durationHours) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: 'Unauthorized' };

        // If Technician, verify ownership (same logic as stage)
        if (session.role === 'TECHNICIAN') {
             const user = await prisma.user.findUnique({ where: { id: session.id } });
             const request = await prisma.maintenanceRequest.findUnique({ where: { id } });
             
             if (!request) return { success: false, error: 'Request not found' };
             
             const isAssigned = request.technicianId === session.id;
             const isTeamAssigned = user?.teamId && request.teamId === user.teamId;

             if (!isAssigned && !isTeamAssigned) {
                 return { success: false, error: 'Unauthorized: You can only update requests assigned to you or your team' };
             }
        }

        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: { 
                durationHours: parseFloat(durationHours),
                updatedAt: new Date() 
            },
        });
        
        revalidatePath('/maintenance');
        return { success: true, data: request };
    } catch (error) {
        console.error('Failed to update request duration:', error);
        return { success: false, error: 'Failed to update request duration' };
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
