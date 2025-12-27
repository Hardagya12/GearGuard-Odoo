
'use server';

import prisma from '@/lib/prisma';

/**
 * Get all maintenance teams with their member counts.
 */
export async function getTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: { members: true, maintainedEquipment: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: teams };
  } catch (error) {
    console.error('Failed to get teams:', error);
    return { success: false, error: 'Failed to fetch teams' };
  }
}

/**
 * Get details of a specific team, including members.
 * @param {string} teamId
 */
export async function getTeamDetails(teamId) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          select: { id: true, name: true, role: true, email: true },
        },
        maintainedEquipment: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    if (!team) return { success: false, error: 'Team not found' };

    return { success: true, data: team };
  } catch (error) {
    console.error('Failed to get team details:', error);
    return { success: false, error: 'Failed to fetch team details' };
  }
}
