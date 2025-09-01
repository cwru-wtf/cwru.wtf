"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const submissionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .endsWith("@case.edu", "Must be a @case.edu email"),
    categories: z
      .array(z.string())
      .min(1, "Please select at least one category"),
    otherCategory: z.string().optional(),
    wtfIdea: z
      .string()
      .min(1, "Please tell us your WTF idea")
      .max(600, "Maximum 100 words (approximately 600 characters)"),
    currentProject: z
      .string()
      .min(1, "Please tell us about your current project")
      .max(600, "Maximum 100 words (approximately 600 characters)"),
    youtubeLink: z.string().url("Please enter a valid URL"),
  })
  .refine(
    (data) => {
      // If "Other" is selected, otherCategory should be provided
      if (
        data.categories.includes("Other") &&
        (!data.otherCategory || data.otherCategory.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the other category",
      path: ["otherCategory"],
    }
  );

type SubmissionData = z.infer<typeof submissionSchema>;

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmissionData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      categories: [],
    },
  });

  const watchCategories = watch("categories");

  const onSubmit = async (data: SubmissionData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Application submitted successfully! We'll be in touch soon."
        );
        reset();
        setShowOtherInput(false);
      } else {
        if (result.error === "Email already submitted") {
          toast.error(
            "This email has already been submitted. Check your inbox for updates!"
          );
        } else if (result.details) {
          // Handle validation errors
          result.details.forEach((error: any) => {
            toast.error(error.message);
          });
        } else {
          toast.error(
            result.error || "Something went wrong. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = watchCategories || [];
    if (checked) {
      setValue("categories", [...currentCategories, category]);
      if (category === "Other") {
        setShowOtherInput(true);
      }
    } else {
      setValue(
        "categories",
        currentCategories.filter((c) => c !== category)
      );
      if (category === "Other") {
        setShowOtherInput(false);
        setValue("otherCategory", "");
      }
    }
  };

  const categoryOptions = [
    "Photography / Film",
    "Art / Design",
    "Coding / Software",
    "Hardware / Electronics",
    "Other",
  ];

  return (
    <form className="mx-auto mt-8 max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            {...register("name")}
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
            {...register("email")}
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
          <label className="block text-sm font-medium text-white mb-3">
            What's your thing?
          </label>
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer hover:bg-gray-800 p-2 rounded"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  checked={watchCategories?.includes(category) || false}
                  onChange={(e) =>
                    handleCategoryChange(category, e.target.checked)
                  }
                />
                <span className="ml-3 text-white">{category}</span>
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="mt-1 text-sm text-red-400">
              {errors.categories.message}
            </p>
          )}
        </div>

        {showOtherInput && (
          <div>
            <input
              {...register("otherCategory")}
              type="text"
              placeholder="Please specify your other category"
              className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none"
            />
            {errors.otherCategory && (
              <p className="mt-1 text-sm text-red-400">
                {errors.otherCategory.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="wtfIdea" className="sr-only">
            WTF Idea
          </label>
          <textarea
            {...register("wtfIdea")}
            id="wtfIdea"
            placeholder="What do you want to build that would make you go WTF? (100 words max)"
            rows={4}
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none resize-vertical"
          />
          {errors.wtfIdea && (
            <p className="mt-1 text-sm text-red-400">
              {errors.wtfIdea.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currentProject" className="sr-only">
            Current Project
          </label>
          <textarea
            {...register("currentProject")}
            id="currentProject"
            placeholder="What's something you have built or are building right now? (100 words max)"
            rows={4}
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none resize-vertical"
          />
          {errors.currentProject && (
            <p className="mt-1 text-sm text-red-400">
              {errors.currentProject.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="youtubeLink"
            className="block text-sm font-medium text-white mb-3"
          >
            Drop a link to a Youtube video of something that interests you!
          </label>
          <input
            {...register("youtubeLink")}
            type="url"
            id="youtubeLink"
            placeholder="https://..."
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white focus:border-green-500 focus:outline-none"
          />
          {errors.youtubeLink && (
            <p className="mt-1 text-sm text-red-400">
              {errors.youtubeLink.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
