import { db } from '@/lib/db';
import { submissions } from '@/lib/schema';
import { count, eq, isNull } from 'drizzle-orm';

export async function getSubmissionStats() {
  try {
    // Get total submissions
    const [totalResult] = await db
      .select({ count: count() })
      .from(submissions);

    // Get approved submissions
    const [approvedResult] = await db
      .select({ count: count() })
      .from(submissions)
      .where(eq(submissions.isApproved, true));

    // Get pending submissions
    const [pendingResult] = await db
      .select({ count: count() })
      .from(submissions)
      .where(isNull(submissions.isApproved));

    // Get rejected submissions
    const [rejectedResult] = await db
      .select({ count: count() })
      .from(submissions)
      .where(eq(submissions.isApproved, false));

    return {
      total: totalResult.count,
      approved: approvedResult.count,
      pending: pendingResult.count,
      rejected: rejectedResult.count,
    };
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    };
  }
}
