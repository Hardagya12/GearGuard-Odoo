
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
        
        revalidatePath('/maintenance');
        return { success: true, data: request };
    } catch (error) {
        console.error('Failed to update request stage:', error);
        return { success: false, error: 'Failed to update request stage' };
    }
}
