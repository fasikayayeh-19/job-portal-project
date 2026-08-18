'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';

import {
  useCompanyJobs,
  useUpdateJob,
} from '@/hooks/useJobs';
import { useApplyJob } from '@/hooks/useMyApplications';
import type { UpdateJobData } from '@/services/jobs.service';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
const applyJob = useApplyJob();
  const jobId = params.id as string;

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useCompanyJobs();

  const updateJob = useUpdateJob();

  const job = jobs.find((item) => item.id === jobId);

  const [form, setForm] = useState<UpdateJobData>({
    title: '',
    description: '',
    requirements: '',
    skills: [],
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    categoryId: '',
  });

 
  const storedUser =
  localStorage.getItem('user');

const user = storedUser
  ? JSON.parse(storedUser)
  : null;

const isJobSeeker =
  user?.role === 'JOB_SEEKER';
  const [skillsInput, setSkillsInput] = useState('');



  // =====================================================
  // LOAD JOB INTO FORM
  // =====================================================

  useEffect(() => {
    if (!job) return;

    setForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills ?? [],
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary ?? '',
      categoryId: job.category?.id ?? '',
    });

    setSkillsInput(
      (job.skills ?? []).join(', '),
    );
  }, [job]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const skills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    updateJob.mutate(
      {
        id: jobId,
        data: {
          ...form,
          skills,
          salary: form.salary || undefined,
          categoryId:
            form.categoryId || undefined,
        },
      },
      {
        onSuccess: () => {
          router.push('/dashboard/jobs');
        },
      },
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-[#1671B9]"
        />
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Failed to load job.
      </div>
    );
  }

  // =====================================================
  // JOB NOT FOUND
  // =====================================================

  if (!job) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Job not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          This job does not exist or does not belong to your company.
        </p>

        <Link
          href="/dashboard/jobs"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to My Jobs
        </Link>
      </div>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}

      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1671B9] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to My Jobs
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Edit Job
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update your job posting information.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >

        {/* Title */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Job Title
          </label>

          <input
            name="title"
            value={form.title ?? ''}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
          </label>

          <textarea
            name="description"
            value={form.description ?? ''}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Requirements */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Requirements
          </label>

          <textarea
            name="requirements"
            value={form.requirements ?? ''}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Skills */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Skills
          </label>

          <input
            value={skillsInput}
            onChange={(e) =>
              setSkillsInput(e.target.value)
            }
            placeholder="React, TypeScript, Node.js"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-1 text-xs text-slate-400">
            Separate skills with commas.
          </p>
        </div>

        {/* Two columns */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* Location */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Location
            </label>

            <input
              name="location"
              value={form.location ?? ''}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Job Type */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Job Type
            </label>

            <input
              name="jobType"
              value={form.jobType ?? ''}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Experience */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Experience
            </label>

            <input
              name="experience"
              value={form.experience ?? ''}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Salary */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Salary
            </label>

            <input
              name="salary"
              value={form.salary ?? ''}
              onChange={handleChange}
              placeholder="e.g. $1,500 - $2,000"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

        </div>

        {/* Category */}

        {job.category && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </label>

            <input
              value={job.category.name}
              disabled
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
            />

            <p className="mt-1 text-xs text-slate-400">
              Category cannot be changed from this page.
            </p>
          </div>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">

          <Link
            href="/dashboard/jobs"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updateJob.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#125d99] disabled:opacity-60"
          >
            {updateJob.isPending && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {updateJob.isPending
              ? 'Saving...'
              : 'Save Changes'}
          </button>

        </div>

      </form>

    </div>
  );
}