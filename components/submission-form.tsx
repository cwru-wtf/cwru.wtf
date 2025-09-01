'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const submissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').endsWith('@case.edu', 'Must be a @case.edu email'),
  interests: z.string().min(1, 'Please tell us what you want to build'),
});

type SubmissionData = z.infer<typeof submissionSchema>;

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SubmissionData>({
    resolver: zodResolver(submissionSchema)
  });

  const onSubmit = async (data: SubmissionData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully! We\'ll be in touch soon.');
        reset();
      } else {
        if (result.error === 'Email already submitted') {
          toast.error('This email has already been submitted. Check your inbox for updates!');
        } else if (result.details) {
          // Handle validation errors
          result.details.forEach((error: any) => {
            toast.error(error.message);
          });
        } else {
          toast.error(result.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mx-auto mt-8 max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            placeholder="Your Name"
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="Your Email (@case.edu)"
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="interests" className="sr-only">
            Interests
          </label>
          <textarea
            {...register('interests')}
            id="interests"
            placeholder="What do you want to build?"
            rows={3}
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none"
          />
          {errors.interests && (
            <p className="mt-1 text-sm text-red-400">{errors.interests.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}
