import { db } from '@/lib/db';
import { actionLogs } from '@/lib/schema';

export async function logAction(
  submissionId: number,
  action: string,
  details?: string
) {
  try {
    await db.insert(actionLogs).values({
      submissionId,
      action,
      details,
    });
  } catch (error) {
    console.error('Error logging action:', error);
    // Don't throw - logging failures shouldn't break the main flow
  }
}
