'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Briefcase,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

import {
  useCreateJob,
} from '@/hooks/useJobs';

import {
  useCategories,
} from '@/hooks/useCategories';

const createJobSchema = z.object({
  categoryId: z
    .string()
    .min(1, 'Please select a category'),

  title: z
    .string()
    .min(2, 'Job title is required'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),

  requirements: z
    .string()
    .min(10, 'Requirements are required'),

  skills: z
    .string()
    .min(1, 'Add at least one skill'),

  location: z
    .string()
    .min(2, 'Location is required'),

  jobType: z
    .string()
    .min(1, 'Please select a job type'),

  experience: z
    .string()
    .min(1, 'Experience is required'),

  salary: z
    .string()
    .optional(),

  deadline: z
    .string()
    .optional(),
});

type CreateJobForm = z.infer<
  typeof createJobSchema
>;

export default function CreateJobPage() {
  const router = useRouter();

  const createJob = useCreateJob();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<CreateJobForm>({
    resolver: zodResolver(
      createJobSchema,
    ),
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      requirements: '',
      skills: '',
      location: '',
      jobType: '',
      experience: '',
      salary: '',
      deadline: '',
    },
  });

  const onSubmit = (
    data: CreateJobForm,
  ) => {
    const skills = data.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    createJob.mutate(
      {
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        skills,
        location: data.location,
        jobType: data.jobType,
        experience: data.experience,
        salary: data.salary || undefined,
        deadline:
          data.deadline || undefined,
      },
      {
        onSuccess: () => {
          router.push('/dashboard/jobs');
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-start gap-4">

        <Link
          href="/dashboard/jobs"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <Briefcase
              size={22}
              className="text-[#1671B9]"
            />

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Post a Job
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create a new job posting and start receiving applications.
          </p>
        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Basic information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Basic Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <FormField
              label="Job Title"
              error={errors.title?.message}
              className="sm:col-span-2"
            >
              <input
                {...register('title')}
                placeholder="e.g. Frontend Developer"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Category"
              error={errors.categoryId?.message}
            >
              <select
                {...register('categoryId')}
                disabled={categoriesLoading}
                className={inputClass}
              >
                <option value="">
                  {categoriesLoading
                    ? 'Loading categories...'
                    : 'Select category'}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ),
                )}
              </select>

              {categoriesError && (
                <p className="mt-1 text-xs text-red-500">
                  Failed to load categories.
                </p>
              )}
            </FormField>

            <FormField
              label="Job Type"
              error={errors.jobType?.message}
            >
              <select
                {...register('jobType')}
                className={inputClass}
              >
                <option value="">
                  Select job type
                </option>
                <option value="FULL_TIME">
                  Full Time
                </option>
                <option value="PART_TIME">
                  Part Time
                </option>
                <option value="CONTRACT">
                  Contract
                </option>
                <option value="INTERNSHIP">
                  Internship
                </option>
                <option value="REMOTE">
                  Remote
                </option>
              </select>
            </FormField>

            <FormField
              label="Location"
              error={errors.location?.message}
            >
              <input
                {...register('location')}
                placeholder="e.g. Addis Ababa"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Experience"
              error={errors.experience?.message}
            >
              <input
                {...register('experience')}
                placeholder="e.g. 2-3 years"
                className={inputClass}
              />
            </FormField>

          </div>

        </section>

        {/* Job details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Job Details
          </h2>

          <div className="mt-5 space-y-5">

            <FormField
              label="Description"
              error={errors.description?.message}
            >
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Describe the role, responsibilities, and what the candidate will do..."
                className={textareaClass}
              />
            </FormField>

            <FormField
              label="Requirements"
              error={errors.requirements?.message}
            >
              <textarea
                {...register('requirements')}
                rows={6}
                placeholder="List the qualifications and requirements for this position..."
                className={textareaClass}
              />
            </FormField>

            <FormField
              label="Skills"
              error={errors.skills?.message}
            >
              <input
                {...register('skills')}
                placeholder="React, TypeScript, Next.js, Git"
                className={inputClass}
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate skills with commas.
              </p>
            </FormField>

          </div>

        </section>

        {/* Additional information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Additional Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <FormField
              label="Salary"
              error={errors.salary?.message}
            >
              <input
                {...register('salary')}
                placeholder="e.g. 25,000 - 35,000 ETB"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Application Deadline"
              error={errors.deadline?.message}
            >
              <input
                type="date"
                {...register('deadline')}
                className={inputClass}
              />
            </FormField>

          </div>

        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <Link
            href="/dashboard/jobs"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={createJob.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1671B9] px-6 text-sm font-semibold text-white hover:bg-[#125d99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createJob.isPending && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {createJob.isPending
              ? 'Posting Job...'
              : 'Post Job'}
          </button>

        </div>

        {createJob.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to create the job. Please check
            your information and try again.
          </div>
        )}

      </form>

    </div>
  );
}

/* =====================================================
   FORM FIELD
===================================================== */

function FormField({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   INPUT STYLES
===================================================== */

const inputClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-1 focus:ring-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white';

const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-1 focus:ring-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white';