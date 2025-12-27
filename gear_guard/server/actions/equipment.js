
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all equipment with optional filters.
 * @param {Object} filters - Optional filters (e.g., teamId, status)
 * @returns {Promise<Array>} List of equipment
 */
export async function getEquipmentList(filters = {}) {
  try {
    const where = {};
    
    if (filters.teamId) {
      where.maintenanceTeamId = filters.teamId;
    }
    
    if (filters.status) {
      where.status = filters.status; // e.g., 'ACTIVE', 'UNDER_MAINTENANCE'
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        maintenanceTeam: {
          select: { name: true },
        },
        assignedToUser: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: equipment };
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    return { success: false, error: 'Failed to fetch equipment list.' };
  }
}

/**
 * Create new equipment
 * @param {Object} data - Equipment data
 */
export async function createEquipment(data) {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        serialNumber: data.serialNumber,
        department: data.department,
        location: data.location,
        status: data.status || 'ACTIVE',
        maintenanceTeamId: data.maintenanceTeamId,
        // Optional fields
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        warrantyExpiration: data.warrantyExpiration ? new Date(data.warrantyExpiration) : null,
        description: data.description,
      },
    });
    
    revalidatePath('/equipment');
    return { success: true, data: equipment };
  } catch (error) {
    console.error('Failed to create equipment:', error);
    return { success: false, error: 'Failed to create equipment.' };
  }
}

export async function updateEquipment(id, data) {
    try {
        const equipment = await prisma.equipment.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        });

        revalidatePath('/equipment');
        return { success: true, data: equipment };
    } catch (error) {
        console.error('Failed to update equipment:', error);
        return { success: false, error: 'Failed to update equipment' };
    }
}

/**
 * Get single equipment with all details and related requests
 */
export async function getEquipmentById(id) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceTeam: {
          select: { id: true, name: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        requests: {
          select: {
            id: true,
            subject: true,
            type: true,
            stage: true,
            priority: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!equipment) {
      return { success: false, error: 'Equipment not found' };
    }

    return { success: true, data: equipment };
  } catch (error) {
    console.error('Failed to get equipment:', error);
    return { success: false, error: 'Failed to fetch equipment details' };
  }
}
