
'use client';

import ProfileImageUpload from '@/components/profile/ProfileImageUpload';
import CompanyLogoUpload from '@/components/profile/CompanyLogoUpload';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Building2,
  Mail,
  MapPin,
  Globe,
  Phone,
  Save,
  Loader2,
  FileText,
} from 'lucide-react';

import api from '@/lib/axios';

interface CompanyProfile {
  id: string;
  companyName: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  location?: string;
  phone?: string;
  status?: string;

  user?: {
    id: string;
    email: string;
  };
}

interface CompanyProfileForm {
  companyName: string;
  description: string;
  website: string;
  location: string;
  phone: string;
}

export default function CompanyProfilePage() {
  const router = useRouter();

  const [company, setCompany] =
    useState<CompanyProfile | null>(null);

  const [form, setForm] =
    useState<CompanyProfileForm>({
      companyName: '',
      description: '',
      website: '',
      location: '',
      phone: '',
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  // =====================================================
  // LOAD COMPANY PROFILE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadCompanyProfile = async () => {
      const token =
        localStorage.getItem('accessToken');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response =
          await api.get('/companies/profile');

        const profile =
          response.data as CompanyProfile;

        if (!mounted) return;

        setCompany(profile);

        setForm({
          companyName:
            profile.companyName ?? '',
          description:
            profile.description ?? '',
          website:
            profile.website ?? '',
          location:
            profile.location ?? '',
          phone:
            profile.phone ?? '',
        });
      } catch (err: any) {
        console.error(
          'Failed to load company profile:',
          err,
        );

        if (err.response?.status === 401) {
          localStorage.removeItem(
            'accessToken',
          );

          localStorage.removeItem('user');

          router.replace('/login');

          return;
        }

        if (mounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load company profile.',
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCompanyProfile();

    return () => {
      mounted = false;
    };
  }, [router]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response =
        await api.patch(
          '/companies/profile',
          form,
        );

      const updatedCompany =
        response.data.company ??
        response.data;

      setCompany(updatedCompany);

      setForm({
        companyName:
          updatedCompany.companyName ?? '',
        description:
          updatedCompany.description ?? '',
        website:
          updatedCompany.website ?? '',
        location:
          updatedCompany.location ?? '',
        phone:
          updatedCompany.phone ?? '',
      });

      setSuccess(
        'Company profile updated successfully.',
      );

      // Update stored user if needed
      const storedUser =
        localStorage.getItem('user');

      if (storedUser) {
        try {
          const currentUser =
            JSON.parse(storedUser);

          localStorage.setItem(
            'user',
            JSON.stringify({
              ...currentUser,
              company: updatedCompany,
            }),
          );

          window.dispatchEvent(
            new Event('userUpdated'),
          );
        } catch (error) {
          console.error(
            'Failed to update stored user:',
            error,
          );
        }
      }
    } catch (err: any) {
      console.error(
        'Failed to update company profile:',
        err,
      );

      setError(
        err.response?.data?.message ||
          'Failed to update company profile.',
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading company profile...
        </div>
      </div>
    );
  }

  // =====================================================
  // NO COMPANY
  // =====================================================

  if (!company) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error ||
            'Company profile not found.'}
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY INITIAL
  // =====================================================

  const initial =
    company.companyName
      ?.charAt(0)
      .toUpperCase() || 'C';

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto w-full max-w-5xl">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Company Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your company information and public profile.
        </p>
      </div>

      {/* =================================================
          PROFILE SUMMARY
      ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="flex flex-col items-center gap-5 sm:flex-row">

          {/* Company Logo */}

         <CompanyLogoUpload
  companyName={company.companyName}
  logoUrl={company.logoUrl}
  onUploaded={(url) => {
    setCompany((previous) =>
      previous
        ? {
            ...previous,
            logoUrl: url,
            logo:url,
          }
        : previous,
    );
  }}
/>

          <div className="text-center sm:text-left">

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {company.companyName}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {company.user?.email}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1671B9] dark:bg-blue-950/30">
                Company
              </span>

              {company.status && (
                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                  {company.status}
                </span>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {Array.isArray(error)
            ? error.join(', ')
            : error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
          {success}
        </div>
      )}

      {/* =================================================
          COMPANY INFORMATION
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Section Header */}

          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
                <Building2 size={19} />
              </div>

              <div>

                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Company Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Update your company's basic information.
                </p>

              </div>

            </div>

          </div>

          {/* Form */}

          <div className="grid gap-5 p-6 sm:grid-cols-2">

            {/* Company Name */}

            <div className="sm:col-span-2">

              <label
                htmlFor="companyName"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company Name
              </label>

              <div className="relative">

                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            {/* Email */}

            <div className="sm:col-span-2">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={
                    company.user?.email ?? ''
                  }
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />

              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Email cannot be changed here.
              </p>

            </div>

            {/* Location */}

            <div>

              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Location
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            {/* Phone */}

            <div>

              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Phone
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +251 912 345 678"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            {/* Website */}

            <div className="sm:col-span-2">

              <label
                htmlFor="website"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Website
              </label>

              <div className="relative">

                <Globe
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

            {/* Description */}

            <div className="sm:col-span-2">

              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company Description
              </label>

              <div className="relative">

                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell job seekers about your company..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-800">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-5 text-sm font-semibold text-white transition hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />

                  Save Changes
                </>
              )}

            </button>

          </div>

        </section>

      </form>

    </div>
  );
}
