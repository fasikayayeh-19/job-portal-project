'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/axios';

const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');

      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      console.log('LOGIN RESPONSE:', response.data);

      const { accessToken, user } = response.data;

      /*
       * Save authentication information.
       *
       * We will later move this into the Zustand
       * authentication store.
       */
      localStorage.setItem(
        'accessToken',
        accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(user),
      );

      // Redirect to the common dashboard.
      router.push('/dashboard');

    } catch (error: any) {
      console.error('LOGIN ERROR:', error);

      const message =
        error?.response?.data?.message ||
        'Invalid email or password. Please try again.';

      setServerError(
        Array.isArray(message)
          ? message[0]
          : message,
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-10 dark:bg-[#0f172a] sm:py-14">

      <div className="mx-auto w-full max-w-2xl">

        {/* Back to Home */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-secondary"
        >
          <ArrowLeft size={17} />

          Back to Home
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 dark:border-slate-700 dark:bg-[#111827]">

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
          <div className="mb-9 text-center">

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Sign in to continue to your Job Portal account.
            </p>

          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {serverError}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary transition-colors hover:text-secondary hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary dark:hover:text-secondary"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Remember Me */}
            <div className="flex items-center">

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary dark:border-slate-600"
                />

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Remember me
                </span>

              </label>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Signing In...'
                : 'Sign In'}
            </button>

          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

          </div>

          {/* Register */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">

            Don't have an account?{' '}

            <Link
              href="/register"
              className="font-semibold text-primary transition-colors hover:text-secondary hover:underline"
            >
              Create an account
            </Link>

          </p>

        </div>

        {/* Employer Message */}
        <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">

          Are you an employer looking for talented candidates?{' '}

          <Link
            href="/register"
            className="font-medium text-primary hover:text-secondary hover:underline"
          >
            Register your company
          </Link>

        </p>

      </div>

    </main>
  );
}