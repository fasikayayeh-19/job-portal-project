'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Search,
  Building2,
  Sparkles,
} from 'lucide-react';

import { useCompanies } from '@/hooks/useCompany';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getImageUrl(path?: string | null) {
  if (!path) return null;

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  return `${API_URL}${path}`;
}

export default function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const limit = 12;

  const { data, isLoading, isError, isFetching } =
    useCompanies(page, limit, search);

  const companies = data?.data ?? [];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 dark:bg-[#070d18]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-white dark:bg-[#070d18]">

        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute left-[-10%] top-[-25%] h-[500px] w-[500px] rounded-full bg-[#0878A8]/10 blur-[100px]" />

          <div className="absolute right-[-10%] top-[-10%] h-[450px] w-[450px] rounded-full bg-[#10A8A5]/10 blur-[100px]" />

          <div className="absolute bottom-[-30%] left-[35%] h-[350px] w-[350px] rounded-full bg-[#0878A8]/5 blur-[100px]" />
        </div>

        {/* Decorative grid */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-[0.035]
            dark:opacity-[0.025]
          "
          style={{
            backgroundImage:
              'linear-gradient(#0878A8 1px, transparent 1px), linear-gradient(90deg, #0878A8 1px, transparent 1px)',
            backgroundSize: '45px 45px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-[#0878A8]/20
                bg-[#0878A8]/5
                px-4 py-2
                text-xs font-bold uppercase tracking-[0.16em]
                text-[#0878A8]
                dark:border-[#10A8A5]/20
                dark:bg-[#10A8A5]/10
                dark:text-[#10A8A5]
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              Explore employers
            </div>

            {/* Heading */}
            <h1
              className="
                mt-7
                text-4xl font-bold tracking-tight
                text-slate-950
                sm:text-5xl
                lg:text-7xl
                dark:text-white
              "
            >
              Discover companies
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-[#0878A8]
                  to-[#10A8A5]
                  bg-clip-text
                  text-transparent
                "
              >
                worth working for.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto mt-6 max-w-2xl
                text-base leading-7
                text-slate-600
                sm:text-lg
                dark:text-slate-400
              "
            >
              Explore leading employers, discover their open
              positions, and find opportunities that match your
              career goals.
            </p>

            {/* =================================================
                SEARCH
            ================================================== */}
            <div className="mx-auto mt-10 max-w-3xl">

              <div
                className="
                  relative rounded-2xl
                  border border-slate-200
                  bg-white
                  p-2
                  shadow-2xl
                  shadow-slate-300/30
                  transition-all duration-300
                  focus-within:border-[#0878A8]/40
                  focus-within:shadow-[#0878A8]/10
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/30
                  dark:focus-within:border-[#10A8A5]/40
                "
              >
                <Search
                  className="
                    absolute left-6 top-1/2
                    h-5 w-5
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search companies or locations..."
                  className="
                    h-14 w-full
                    rounded-xl
                    bg-transparent
                    pl-12 pr-5
                    text-sm font-medium
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />
              </div>

              <p className="mt-3 text-xs text-slate-400 dark:text-slate-600">
                Search by company name or location
              </p>
            </div>

            {/* =================================================
                QUICK STATS
            ================================================== */}
            {data && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">

                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0878A8] dark:bg-[#10A8A5]" />

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    <strong className="font-bold text-slate-900 dark:text-white">
                      {data.total}
                    </strong>{' '}
                    {data.total === 1
                      ? 'company'
                      : 'companies'}
                  </span>
                </div>

                <div className="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-800" />

                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-[#0878A8] dark:text-[#10A8A5]" />

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Find your next opportunity
                  </span>
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          COMPANY DIRECTORY
      ====================================================== */}
      <section
        className="
          relative
          border-t border-slate-200/70
          bg-slate-50
          dark:border-slate-800/70
          dark:bg-[#0a1120]
        "
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          {/* Section header */}
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#0878A8] to-[#10A8A5]" />

                <span
                  className="
                    text-xs font-bold uppercase
                    tracking-[0.18em]
                    text-[#0878A8]
                    dark:text-[#10A8A5]
                  "
                >
                  Company directory
                </span>
              </div>

              <h2
                className="
                  mt-3
                  text-2xl font-bold tracking-tight
                  text-slate-950
                  sm:text-3xl
                  dark:text-white
                "
              >
                Explore employers
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Discover companies and explore their available
                opportunities.
              </p>
            </div>

            {isFetching && !isLoading && (
              <div
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-[#0878A8]/10
                  bg-white
                  px-4 py-2
                  text-xs font-semibold
                  text-[#0878A8]
                  shadow-sm
                  dark:border-[#10A8A5]/10
                  dark:bg-slate-900
                  dark:text-[#10A8A5]
                "
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                Updating results
              </div>
            )}

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    rounded-3xl
                    border border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <div className="animate-pulse">

                    <div className="flex justify-between">
                      <div className="h-20 w-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="mt-7 h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-3 h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-6 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-7 border-t border-slate-100 pt-5 dark:border-slate-800">
                      <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}
          {isError && !isLoading && (
            <div
              className="
                rounded-3xl
                border border-red-200
                bg-white
                px-6 py-20
                text-center
                shadow-sm
                dark:border-red-900/40
                dark:bg-slate-900
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
                <Building2 className="h-7 w-7 text-red-500" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                Unable to load companies
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Something went wrong while loading the company
                directory. Please try again later.
              </p>
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================== */}
          {!isLoading &&
            !isError &&
            companies.length === 0 && (
              <div
                className="
                  rounded-3xl
                  border border-dashed
                  border-slate-300
                  bg-white
                  px-6 py-20
                  text-center
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    mx-auto flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    bg-slate-100
                    dark:bg-slate-800
                  "
                >
                  <Search className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  No companies found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We couldn't find any companies matching your
                  search. Try another company name or location.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="
                      mt-6
                      rounded-xl
                      bg-[#0878A8]/10
                      px-5 py-2.5
                      text-sm font-semibold
                      text-[#0878A8]
                      transition
                      hover:bg-[#0878A8]/15
                      dark:bg-[#10A8A5]/10
                      dark:text-[#10A8A5]
                      dark:hover:bg-[#10A8A5]/15
                    "
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

          {/* =================================================
              COMPANY CARDS
          ================================================== */}
          {!isLoading &&
            !isError &&
            companies.length > 0 && (
              <>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                  {companies.map((company) => {
                    const logo = getImageUrl(company.logoUrl);

                    return (
                      <Link
                        key={company.id}
                        href={`/companies/${company.id}`}
                        className="group block h-full"
                      >
                        <article
                          className="
                            relative flex h-full
                            flex-col overflow-hidden
                            rounded-3xl
                            border border-slate-200
                            bg-white
                            shadow-sm
                            transition-all duration-500
                            hover:-translate-y-2
                            hover:border-[#0878A8]/25
                            hover:shadow-2xl
                            hover:shadow-[#0878A8]/10
                            dark:border-slate-800
                            dark:bg-slate-900
                            dark:hover:border-[#10A8A5]/25
                            dark:hover:shadow-black/40
                          "
                        >

                          {/* Top gradient line */}
                          <div
                            className="
                              absolute left-0 right-0 top-0
                              h-1
                              bg-gradient-to-r
                              from-[#0878A8]
                              via-[#0d91aa]
                              to-[#10A8A5]
                              opacity-0
                              transition-opacity duration-500
                              group-hover:opacity-100
                            "
                          />

                          {/* Soft card glow */}
                          <div
                            className="
                              pointer-events-none
                              absolute right-[-70px] top-[-70px]
                              h-40 w-40
                              rounded-full
                              bg-[#0878A8]/5
                              blur-2xl
                              transition-all duration-500
                              group-hover:bg-[#10A8A5]/10
                            "
                          />

                          <div className="relative flex flex-1 flex-col p-7">

                            {/* =================================================
                                TOP
                            ================================================== */}
                            <div className="flex items-start justify-between">

                              {/* Logo */}
                              <div
                                className="
                                  flex h-20 w-20
                                  items-center justify-center
                                  overflow-hidden
                                  rounded-2xl
                                  border border-slate-200
                                  bg-slate-50
                                  shadow-sm
                                  transition-all duration-500
                                  group-hover:scale-105
                                  group-hover:border-[#0878A8]/20
                                  group-hover:shadow-lg
                                  dark:border-slate-700
                                  dark:bg-slate-800
                                  dark:group-hover:border-[#10A8A5]/20
                                "
                              >
                                {logo ? (
                                  <img
                                    src={logo}
                                    alt={`${company.companyName} logo`}
                                    className="
                                      h-full w-full
                                      object-contain
                                      p-3
                                    "
                                  />
                                ) : (
                                  <BriefcaseBusiness
                                    className="
                                      h-8 w-8
                                      text-[#0878A8]
                                      dark:text-[#10A8A5]
                                    "
                                  />
                                )}
                              </div>

                              {/* Arrow */}
                              <div
                                className="
                                  flex h-10 w-10
                                  items-center justify-center
                                  rounded-full
                                  border border-slate-200
                                  bg-white
                                  text-slate-400
                                  transition-all duration-300
                                  group-hover:border-[#0878A8]/20
                                  group-hover:bg-[#0878A8]/5
                                  group-hover:text-[#0878A8]
                                  dark:border-slate-700
                                  dark:bg-slate-900
                                  dark:text-slate-500
                                  dark:group-hover:border-[#10A8A5]/20
                                  dark:group-hover:bg-[#10A8A5]/10
                                  dark:group-hover:text-[#10A8A5]
                                "
                              >
                                <ArrowRight
                                  className="
                                    h-4 w-4
                                    transition-transform duration-300
                                    group-hover:translate-x-1
                                  "
                                />
                              </div>

                            </div>

                            {/* =================================================
                                COMPANY INFO
                            ================================================== */}
                            <div className="mt-7">

                              <h3
                                className="
                                  line-clamp-1
                                  text-xl font-bold
                                  tracking-tight
                                  text-slate-950
                                  transition-colors duration-300
                                  group-hover:text-[#0878A8]
                                  dark:text-white
                                  dark:group-hover:text-[#10A8A5]
                                "
                              >
                                {company.companyName}
                              </h3>

                              {/* Location */}
                              {company.location && (
                                <div
                                  className="
                                    mt-3
                                    flex items-center gap-2
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                  "
                                >
                                  <MapPin
                                    className="
                                      h-4 w-4 shrink-0
                                      text-[#0878A8]
                                      dark:text-[#10A8A5]
                                    "
                                  />

                                  <span className="line-clamp-1">
                                    {company.location}
                                  </span>
                                </div>
                              )}

                              {/* Description */}
                              {company.description && (
                                <p
                                  className="
                                    mt-5
                                    line-clamp-2
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                  "
                                >
                                  {company.description}
                                </p>
                              )}

                              {/* Website */}
                              {company.website && (
                                <div
                                  className="
                                    mt-4
                                    flex items-center gap-2
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                  "
                                >
                                  <Globe
                                    className="
                                      h-4 w-4 shrink-0
                                      text-slate-400
                                    "
                                  />

                                  <span className="line-clamp-1">
                                    {company.website.replace(
                                      /^https?:\/\//,
                                      '',
                                    )}
                                  </span>
                                </div>
                              )}

                            </div>

                            {/* =================================================
                                BOTTOM
                            ================================================== */}
                            <div className="mt-auto pt-7">

                              <div
                                className="
                                  flex items-center
                                  justify-between
                                  border-t
                                  border-slate-100
                                  pt-5
                                  dark:border-slate-800
                                "
                              >

                                {/* Job count */}
                                <div className="flex items-center gap-3">

                                  <div
                                    className="
                                      flex h-10 w-10
                                      items-center justify-center
                                      rounded-xl
                                      bg-gradient-to-br
                                      from-[#0878A8]/10
                                      to-[#10A8A5]/10
                                      text-[#0878A8]
                                      dark:text-[#10A8A5]
                                    "
                                  >
                                    <BriefcaseBusiness className="h-4 w-4" />
                                  </div>

                                  <div>
                                    <p
                                      className="
                                        text-sm font-bold
                                        text-slate-900
                                        dark:text-white
                                      "
                                    >
                                      {company.jobCount}
                                    </p>

                                    <p
                                      className="
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-500
                                      "
                                    >
                                      {company.jobCount === 1
                                        ? 'Open position'
                                        : 'Open positions'}
                                    </p>
                                  </div>

                                </div>

                                {/* View */}
                                <span
                                  className="
                                    flex items-center gap-1.5
                                    text-sm font-semibold
                                    text-slate-500
                                    transition-all duration-300
                                    group-hover:gap-2
                                    group-hover:text-[#0878A8]
                                    dark:text-slate-400
                                    dark:group-hover:text-[#10A8A5]
                                  "
                                >
                                  Explore
                                  <ArrowRight className="h-4 w-4" />
                                </span>

                              </div>

                            </div>

                          </div>
                        </article>
                      </Link>
                    );
                  })}

                </div>

                {/* =================================================
                    PAGINATION
                ================================================== */}
                {data && data.totalPages > 1 && (
                  <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Page{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {page}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {data.totalPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">

                      {/* Previous */}
                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                          setPage((current) =>
                            Math.max(1, current - 1),
                          )
                        }
                        className="
                          flex h-11 w-11
                          items-center justify-center
                          rounded-xl
                          border border-slate-200
                          bg-white
                          text-slate-500
                          shadow-sm
                          transition-all
                          hover:border-[#0878A8]
                          hover:text-[#0878A8]
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:text-slate-400
                          dark:hover:border-[#10A8A5]
                          dark:hover:text-[#10A8A5]
                        "
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1.5">

                        {Array.from(
                          { length: data.totalPages },
                          (_, index) => index + 1,
                        ).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            type="button"
                            onClick={() =>
                              setPage(pageNumber)
                            }
                            className={`
                              flex h-11 min-w-11
                              items-center justify-center
                              rounded-xl
                              px-3
                              text-sm font-semibold
                              transition-all duration-200
                              ${
                                page === pageNumber
                                  ? 'bg-gradient-to-r from-[#0878A8] to-[#10A8A5] text-white shadow-lg shadow-[#0878A8]/20'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#0878A8]/40 hover:text-[#0878A8] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-[#10A8A5]/40 dark:hover:text-[#10A8A5]'
                              }
                            `}
                          >
                            {pageNumber}
                          </button>
                        ))}

                      </div>

                      {/* Next */}
                      <button
                        type="button"
                        disabled={page === data.totalPages}
                        onClick={() =>
                          setPage((current) =>
                            Math.min(
                              data.totalPages,
                              current + 1,
                            ),
                          )
                        }
                        className="
                          flex h-11 w-11
                          items-center justify-center
                          rounded-xl
                          border border-slate-200
                          bg-white
                          text-slate-500
                          shadow-sm
                          transition-all
                          hover:border-[#0878A8]
                          hover:text-[#0878A8]
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:text-slate-400
                          dark:hover:border-[#10A8A5]
                          dark:hover:text-[#10A8A5]
                        "
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                    </div>
                  </div>
                )}

              </>
            )}

        </div>
      </section>
    </main>
  );
}