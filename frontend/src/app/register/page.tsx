'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
const registerSchema = z
  .object({
    role: z.enum(['JOB_SEEKER', 'COMPANY']),

    firstName: z.string().optional(),
    lastName: z.string().optional(),

    companyName: z.string().optional(),
    website: z.string().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),

    email: z.string().email('Please enter a valid email'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }

    if (data.role === 'JOB_SEEKER') {
      if (!data.firstName?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['firstName'],
          message: 'First name is required',
        });
      }

      if (!data.lastName?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['lastName'],
          message: 'Last name is required',
        });
      }
    }

    if (data.role === 'COMPANY') {
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['companyName'],
          message: 'Company name is required',
        });
      }
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [accountType, setAccountType] =
    useState<'JOB_SEEKER' | 'COMPANY'>('JOB_SEEKER');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'JOB_SEEKER',
    },
  });

  const handleAccountTypeChange = (
    type: 'JOB_SEEKER' | 'COMPANY',
  ) => {
    setAccountType(type);
    setValue('role', type);
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('REGISTER DATA:', data);

    // Backend connection will be added here.
  };


    return (
  <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-[#020817] sm:py-14">
    <div className="mx-auto w-full max-w-2xl">

      {/* Back */}
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
      >
        <ArrowLeft size={17} />
        Back
      </Link>

      {/* Register Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#1e293b] dark:bg-[#0f172a] sm:p-8">
           <Link
  href="/"
  className="flex items-center"
>
  <Image
    src={process.env.NEXT_PUBLIC_LOGO_URL!}
    alt="Job Portal"
    width={70}
    height={30}
    priority
    className="h-auto w-auto object-contain"
  />
</Link>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-[#94a3b8]">
              Join Job Portal and take the next step in your career.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* Account Type */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-white">
                I want to register as
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Job Seeker */}
                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange('JOB_SEEKER')
                  }
                  className={`rounded-xl border p-5 text-left transition ${
                    accountType === 'JOB_SEEKER'
                      ? 'border-[#1671B9] bg-blue-50 ring-2 ring-[#1671B9]/20 dark:bg-[#111f38]'
                      : 'border-slate-200 hover:border-[#1671B9] dark:border-[#334155]'
                  }`}
                >
                  <div className="mb-2 text-2xl">
                    👤
                  </div>

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Job Seeker
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-[#94a3b8]">
                    Find jobs and apply to opportunities.
                  </p>
                </button>

                {/* Company */}
                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange('COMPANY')
                  }
                  className={`rounded-xl border p-5 text-left transition ${
                    accountType === 'COMPANY'
                      ? 'border-[#1671B9] bg-blue-50 ring-2 ring-[#1671B9]/20 dark:bg-[#111f38]'
                      : 'border-slate-200 hover:border-[#1671B9] dark:border-[#334155]'
                  }`}
                >
                  <div className="mb-2 text-2xl">
                    🏢
                  </div>

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Company
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-[#94a3b8]">
                    Find talent and publish job opportunities.
                  </p>
                </button>

              </div>

              <input
                type="hidden"
                {...register('role')}
              />
            </div>

            {/* JOB SEEKER */}
            {accountType === 'JOB_SEEKER' && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    {...register('firstName')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />

                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register('lastName')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />

                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* COMPANY */}
            {accountType === 'COMPANY' && (
              <div className="space-y-5">

                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    Company Name
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    placeholder="Example Technologies"
                    {...register('companyName')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />

                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    Website
                    <span className="ml-1 text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    {...register('website')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    Phone
                    <span className="ml-1 text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+251 9XX XXX XXX"
                    {...register('phone')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
                  >
                    Company Description
                    <span className="ml-1 text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Tell job seekers about your company..."
                    {...register('description')}
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                  />
                </div>

              </div>
            )}

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  {...register('password')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-[#1671B9]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-white"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder:text-[#64748b]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-[#1671B9]"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1671B9] px-4 py-3 font-semibold text-white transition hover:bg-[#0F5F9E] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Creating Account...'
                : accountType === 'COMPANY'
                  ? 'Create Company Account'
                  : 'Create Job Seeker Account'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-[#94a3b8]">
            Already have an account?{' '}

            <Link
              href="/login"
              className="font-semibold text-[#1671B9] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}