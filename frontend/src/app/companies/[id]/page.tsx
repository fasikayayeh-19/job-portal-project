'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  Globe,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';

import { useCompanyById } from '@/hooks/useCompany';

export default function CompanyDetailsPage() {
  const params = useParams();

  const id =
    typeof params.id === 'string'
      ? params.id
      : '';

  const {
    data: company,
    isLoading,
    isError,
  } = useCompanyById(id);

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Back skeleton */}
          <div className="mb-7 h-5 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          {/* Header skeleton */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />

            <div className="p-6 sm:p-8">
              <div className="-mt-16">
                <div className="h-28 w-28 animate-pulse rounded-3xl bg-slate-300 dark:bg-slate-700" />
              </div>

              <div className="mt-6 h-8 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="mt-4 h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="mt-8 h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>

          </div>

          {/* Content skeleton */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">

            <div className="space-y-8 lg:col-span-2">
              <div className="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="space-y-6">
              <div className="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-56 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>

          </div>
        </div>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError || !company) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#070d18]">

        <div
          className="
            w-full max-w-md
            rounded-3xl
            border border-slate-200
            bg-white
            p-8
            text-center
            shadow-xl
            shadow-slate-200/40
            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/30
          "
        >

          <div
            className="
              mx-auto flex h-16 w-16
              items-center justify-center
              rounded-2xl
              bg-red-50
              dark:bg-red-950/30
            "
          >
            <Building2 className="h-7 w-7 text-red-500 dark:text-red-400" />
          </div>

          <h1 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
            Company not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            We couldn't load this company. It may have been removed
            or the link may no longer be available.
          </p>

          <Link
            href="/companies"
            className="
              mt-7
              inline-flex items-center gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#0878A8]
              to-[#10A8A5]
              px-5 py-3
              text-sm font-semibold
              text-white
              shadow-lg
              shadow-[#0878A8]/20
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-xl
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>

        </div>

      </main>
    );
  }

  /* =========================
     IMAGE URL
  ========================= */

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001';

  const logoUrl = company.logoUrl
    ? company.logoUrl.startsWith('http')
      ? company.logoUrl
      : `${API_URL}${company.logoUrl}`
    : null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070d18]">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            BACK
        ====================================================== */}

        <Link
          href="/companies"
          className="
            group
            mb-7
            inline-flex items-center gap-2
            text-sm font-semibold
            text-slate-500
            transition-colors
            hover:text-[#0878A8]
            dark:text-slate-400
            dark:hover:text-[#10A8A5]
          "
        >
          <ArrowLeft
            className="
              h-4 w-4
              transition-transform duration-200
              group-hover:-translate-x-1
            "
          />

          Back to Companies
        </Link>

        {/* =====================================================
            COMPANY HERO
        ====================================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-xl
            shadow-slate-200/40
            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/30
          "
        >

          {/* Hero background */}
          <div className="relative h-52 overflow-hidden">

            {/* Gradient */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-br
                from-[#075985]
                via-[#0878A8]
                to-[#10A8A5]
              "
            />

            {/* Decorative glow */}
            <div
              className="
                absolute -right-24 -top-28
                h-80 w-80
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute -bottom-32 left-1/3
                h-72 w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />

            {/* Small label */}
            <div className="absolute left-6 top-6 sm:left-8 sm:top-7">
              <div
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-white/20
                  bg-white/10
                  px-3.5 py-2
                  text-xs font-semibold
                  text-white
                  backdrop-blur-md
                "
              >
                <Building2 className="h-3.5 w-3.5" />
                Company profile
              </div>
            </div>

          </div>

          {/* Company information */}
          <div className="relative px-6 pb-8 sm:px-8 lg:px-10">

            <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              {/* Logo + details */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                {/* Logo */}
                <div
                  className="
                    flex h-32 w-32
                    shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-3xl
                    border-[5px]
                    border-white
                    bg-white
                    shadow-2xl
                    dark:border-slate-900
                    dark:bg-slate-800
                  "
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${company.companyName} logo`}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <Building2
                      className="
                        h-14 w-14
                        text-[#0878A8]
                        dark:text-[#10A8A5]
                      "
                    />
                  )}
                </div>

                {/* Name */}
                <div className="pb-1">

                  <h1
                    className="
                      text-2xl font-bold
                      tracking-tight
                      text-slate-950
                      sm:text-3xl
                      lg:text-4xl
                      dark:text-white
                    "
                  >
                    {company.companyName}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">

                    {company.location && (
                      <span
                        className="
                          flex items-center gap-2
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        <MapPin
                          className="
                            h-4 w-4
                            text-[#0878A8]
                            dark:text-[#10A8A5]
                          "
                        />

                        {company.location}
                      </span>
                    )}

                    <span
                      className="
                        flex items-center gap-2
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      <Briefcase
                        className="
                          h-4 w-4
                          text-[#0878A8]
                          dark:text-[#10A8A5]
                        "
                      />

                      {company.jobCount}{' '}
                      {company.jobCount === 1
                        ? 'open job'
                        : 'open jobs'}
                    </span>

                  </div>
                </div>

              </div>

              {/* Website */}
              {company.website && (
                <a
                  href={
                    company.website.startsWith('http')
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group inline-flex
                    items-center justify-center
                    gap-2
                    rounded-xl
                    border border-slate-200
                    bg-white
                    px-5 py-3
                    text-sm font-semibold
                    text-slate-700
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-[#0878A8]/30
                    hover:text-[#0878A8]
                    hover:shadow-md
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-200
                    dark:hover:border-[#10A8A5]/30
                    dark:hover:text-[#10A8A5]
                  "
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink
                    className="
                      h-3.5 w-3.5
                      transition-transform
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </a>
              )}

            </div>

          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-8 lg:col-span-2">

            {/* =================================================
                ABOUT
            ================================================= */}

            <section
              className="
                rounded-3xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
                sm:p-8
                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#0878A8]/10
                    text-[#0878A8]
                    dark:bg-[#10A8A5]/10
                    dark:text-[#10A8A5]
                  "
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      text-xs font-bold uppercase
                      tracking-[0.16em]
                      text-[#0878A8]
                      dark:text-[#10A8A5]
                    "
                  >
                    About the company
                  </p>

                  <h2
                    className="
                      mt-1
                      text-xl font-bold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    About {company.companyName}
                  </h2>
                </div>

              </div>

              <div className="mt-7">

                {company.description ? (
                  <p
                    className="
                      whitespace-pre-line
                      text-sm leading-7
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {company.description}
                  </p>
                ) : (
                  <div
                    className="
                      rounded-2xl
                      border border-dashed
                      border-slate-200
                      bg-slate-50
                      px-5 py-8
                      text-center
                      dark:border-slate-700
                      dark:bg-slate-800/50
                    "
                  >
                    <Building2 className="mx-auto h-7 w-7 text-slate-400" />

                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      This company hasn't provided a description yet.
                    </p>
                  </div>
                )}

              </div>

            </section>

            {/* =================================================
                JOBS
            ================================================= */}

            <section
              className="
                rounded-3xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
                sm:p-8
                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">
                    <Briefcase
                      className="
                        h-5 w-5
                        text-[#0878A8]
                        dark:text-[#10A8A5]
                      "
                    />

                    <h2
                      className="
                        text-xl font-bold
                        text-slate-950
                        dark:text-white
                      "
                    >
                      Jobs at {company.companyName}
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Current opportunities from this company.
                  </p>

                </div>

                {/* Job count badge */}
                <div
                  className="
                    inline-flex w-fit
                    items-center gap-2
                    rounded-full
                    bg-[#0878A8]/10
                    px-4 py-2
                    text-sm font-semibold
                    text-[#0878A8]
                    dark:bg-[#10A8A5]/10
                    dark:text-[#10A8A5]
                  "
                >
                  <Briefcase className="h-4 w-4" />

                  {company.jobCount}{' '}
                  {company.jobCount === 1
                    ? 'position'
                    : 'positions'}
                </div>

              </div>

              {/* Jobs status */}
              <div
                className="
                  relative mt-7
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  p-8
                  text-center
                  dark:border-slate-700
                  dark:bg-slate-800/50
                "
              >

                {/* Decorative glow */}
                <div
                  className="
                    pointer-events-none
                    absolute left-1/2 top-0
                    h-32 w-32
                    -translate-x-1/2
                    rounded-full
                    bg-[#0878A8]/5
                    blur-3xl
                    dark:bg-[#10A8A5]/5
                  "
                />

                <div className="relative">

                  <div
                    className="
                      mx-auto flex h-16 w-16
                      items-center justify-center
                      rounded-2xl
                      bg-white
                      shadow-sm
                      dark:bg-slate-900
                    "
                  >
                    <Briefcase
                      className="
                        h-7 w-7
                        text-[#0878A8]
                        dark:text-[#10A8A5]
                      "
                    />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {company.jobCount > 0
                      ? `${company.jobCount} open ${
                          company.jobCount === 1
                            ? 'position'
                            : 'positions'
                        }`
                      : 'No open jobs right now'}
                  </h3>

                  <p
                    className="
                      mx-auto mt-2 max-w-md
                      text-sm leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {company.jobCount > 0
                      ? 'Explore the available opportunities and find a role that matches your career goals.'
                      : 'There are currently no open positions from this company. Check back later for new opportunities.'}
                  </p>

                  <Link
                    href="/jobs"
                    className="
                      group
                      mt-6
                      inline-flex items-center gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-[#0878A8]
                      to-[#10A8A5]
                      px-5 py-3
                      text-sm font-semibold
                      text-white
                      shadow-lg
                      shadow-[#0878A8]/20
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:shadow-xl
                    "
                  >
                    <Search className="h-4 w-4" />

                    Browse Jobs

                    <ArrowRight
                      className="
                        h-4 w-4
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </Link>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* =================================================
                COMPANY INFORMATION
            ================================================= */}

            <section
              className="
                rounded-3xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-[#0878A8]/10
                    text-[#0878A8]
                    dark:bg-[#10A8A5]/10
                    dark:text-[#10A8A5]
                  "
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Overview
                  </p>

                  <h2 className="mt-0.5 text-lg font-bold text-slate-950 dark:text-white">
                    Company Information
                  </h2>
                </div>

              </div>

              <div className="mt-7 space-y-1">

                {/* Location */}
                {company.location && (
                  <div
                    className="
                      flex gap-4
                      rounded-2xl
                      p-3
                      transition-colors
                      hover:bg-slate-50
                      dark:hover:bg-slate-800/60
                    "
                  >

                    <div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    >
                      <MapPin
                        className="
                          h-4 w-4
                          text-[#0878A8]
                          dark:text-[#10A8A5]
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {company.location}
                      </p>
                    </div>

                  </div>
                )}

                {/* Jobs */}
                <div
                  className="
                    flex gap-4
                    rounded-2xl
                    p-3
                    transition-colors
                    hover:bg-slate-50
                    dark:hover:bg-slate-800/60
                  "
                >

                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  >
                    <Briefcase
                      className="
                        h-4 w-4
                        text-[#0878A8]
                        dark:text-[#10A8A5]
                      "
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Open Jobs
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {company.jobCount}{' '}
                      {company.jobCount === 1
                        ? 'position'
                        : 'positions'}
                    </p>
                  </div>

                </div>

                {/* Joined */}
                <div
                  className="
                    flex gap-4
                    rounded-2xl
                    p-3
                    transition-colors
                    hover:bg-slate-50
                    dark:hover:bg-slate-800/60
                  "
                >

                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  >
                    <CalendarDays
                      className="
                        h-4 w-4
                        text-[#0878A8]
                        dark:text-[#10A8A5]
                      "
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Joined
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(
                        company.createdAt,
                      ).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                </div>

              </div>

              {/* Website */}
              {company.website && (
                <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">

                  <a
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      flex items-center justify-between
                      rounded-xl
                      bg-slate-50
                      px-4 py-3
                      transition-colors
                      hover:bg-[#0878A8]/5
                      dark:bg-slate-800/60
                      dark:hover:bg-[#10A8A5]/10
                    "
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <Globe
                        className="
                          h-4 w-4 shrink-0
                          text-[#0878A8]
                          dark:text-[#10A8A5]
                        "
                      />

                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                        {company.website.replace(
                          /^https?:\/\//,
                          '',
                        )}
                      </span>

                    </div>

                    <ExternalLink
                      className="
                        h-4 w-4 shrink-0
                        text-slate-400
                        transition-colors
                        group-hover:text-[#0878A8]
                        dark:group-hover:text-[#10A8A5]
                      "
                    />

                  </a>

                </div>
              )}

            </section>

            {/* =================================================
                FIND JOBS CTA
            ================================================= */}

            <section
              className="
                relative overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-[#075985]
                via-[#0878A8]
                to-[#10A8A5]
                p-7
                text-white
                shadow-xl
                shadow-[#0878A8]/20
              "
            >

              {/* Background decoration */}
              <div
                className="
                  pointer-events-none
                  absolute -right-16 -top-16
                  h-40 w-40
                  rounded-full
                  bg-white/10
                  blur-2xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute -bottom-20 -left-10
                  h-36 w-36
                  rounded-full
                  bg-white/10
                  blur-2xl
                "
              />

              <div className="relative">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-white/15
                    backdrop-blur-sm
                  "
                >
                  <Sparkles className="h-5 w-5" />
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  Find your next opportunity
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/80">
                  Explore open positions from companies hiring
                  across the platform.
                </p>

                <Link
                  href="/jobs"
                  className="
                    group
                    mt-6
                    flex w-full
                    items-center justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-4 py-3
                    text-sm font-bold
                    text-[#0878A8]
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-slate-50
                    hover:shadow-lg
                  "
                >
                  <Search className="h-4 w-4" />
                  Find Jobs

                  <ArrowRight
                    className="
                      h-4 w-4
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>

              </div>

            </section>

          </aside>

        </div>
      </div>
    </main>
  );
}