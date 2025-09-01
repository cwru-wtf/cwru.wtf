import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logAction } from '@/lib/action-logger';

const submissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').endsWith('@case.edu', 'Must be a @case.edu email'),
  interests: z.string().min(1, 'Please tell us what you want to build'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = submissionSchema.parse(body);
    
    // Check if email already exists
    const existingSubmission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.email, validatedData.email))
      .limit(1);
    
    if (existingSubmission.length > 0) {
      return NextResponse.json(
        { error: 'Email already submitted' },
        { status: 400 }
      );
    }
    
    // Insert the new submission
    const [newSubmission] = await db
      .insert(submissions)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        interests: validatedData.interests,
      })
      .returning();
    
    // Log the submission
    await logAction(newSubmission.id, 'submitted', `New submission from ${validatedData.email}`);
    
    return NextResponse.json(
      { 
        message: 'Application submitted successfully!',
        id: newSubmission.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
