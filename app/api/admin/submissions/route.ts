import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { submissions } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { logAction } from '@/lib/action-logger';
import { getEmailTemplate } from '@/lib/email-templates';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const allSubmissions = await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt));

    return NextResponse.json(allSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a PATCH endpoint to approve/reject submissions
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, isApproved } = await request.json();
    
    const [updatedSubmission] = await db
      .update(submissions)
      .set({ 
        isApproved,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
      .returning();

    // Log the action
    const action = isApproved ? 'approved' : 'rejected';
    await logAction(id, action, `Submission ${action} via admin panel`);

    // Note: In a real app, you'd integrate with an email service like SendGrid, Resend, etc.
    // For now, we'll just log what email would be sent
    if (updatedSubmission) {
      const emailTemplate = getEmailTemplate(
        isApproved ? 'approved' : 'rejected', 
        updatedSubmission.name
      );
      
      console.log(`Would send email to ${updatedSubmission.email}:`);
      console.log('Subject:', emailTemplate.subject);
      console.log('Body:', emailTemplate.text);
      
      await logAction(id, 'email_queued', `${action} email queued for ${updatedSubmission.email}`);
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
