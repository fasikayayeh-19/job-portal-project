'use client';
import { useHome } from '@/hooks/useHome';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Users,
  Star,
} from 'lucide-react';
import TrustedCompaniesSection from './TrustedCompaniesSection';
interface HeroStats {
  totalJobs: number;
  totalCompanies: number;
  successRate?: number;
}

interface HeroSectionProps {
  stats: HeroStats;
}

const popularSearches = [
  'Software Developer',
  'Marketing',
  'Sales',
  'Customer Service',
  'Design',
];

export default function HeroSection({
  stats,
}: HeroSectionProps) {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const {
    data,
    isLoading,
    isError,
  } = useHome();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set('search', keyword.trim());
    }

    if (location.trim()) {
      params.set('location', location.trim());
    }

    router.push(`/jobs?${params.toString()}`);
  };

  const handlePopularSearch = (search: string) => {
    router.push(
      `/jobs?search=${encodeURIComponent(search)}`,
    );
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none pl-5 absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-950/30" />

      <div className="mx-auto max-w-8xl px-10 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-6">

          {/* =====================================================
              LEFT SIDE
          ===================================================== */}
          <div className="relative z-10">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1671B9] dark:bg-blue-950/40 dark:text-blue-400">
              <Star
                size={16}
                className="fill-current"
              />

              Find Your Next Opportunity
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Find the right job.
              <br />

              <span className="text-[#1671B9]">
                Build your future.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Discover thousands of job opportunities
              from trusted companies and take the next
              step in your career.
            </p>

            {/* =================================================
                SEARCH BOX
            ================================================= */}
            <form
              onSubmit={handleSearch}
              className="
                mt-8
                max-w-7xl
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-lg
                shadow-slate-200/50
                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-none
              "
            >
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

                {/* Keyword */}
                <div>
                  <label
                    htmlFor="hero-keyword"
                    className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Job title or keyword
                  </label>

                  <div className="relative">
                    <Search
                      size={18}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="hero-keyword"
                      type="text"
                      value={keyword}
                      onChange={(e) =>
                        setKeyword(e.target.value)
                      }
                      placeholder="e.g. Software Developer"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        pl-10
                        pr-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#1671B9]
                        focus:ring-2
                        focus:ring-[#1671B9]/20
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                      "
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="hero-location"
                    className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="hero-location"
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="e.g. Addis Ababa, Ethiopia"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        pl-10
                        pr-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#1671B9]
                        focus:ring-2
                        focus:ring-[#1671B9]/20
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                      "
                    />
                  </div>
                </div>

                {/* Search button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="
                      flex
                      h-12
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#1671B9]
                      px-6
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#125f9c]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1671B9]/30
                      md:w-auto
                    "
                  >
                    <Search size={18} />
                    Search Jobs
                  </button>
                </div>
              </div>

              {/* Popular searches */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Popular Searches:
                </p>

                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() =>
                        handlePopularSearch(search)
                      }
                      className="
                        rounded-full
                        border
                        border-blue-200
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-[#1671B9]
                        transition
                        hover:bg-[#1671B9]
                        hover:text-white
                        dark:border-blue-900
                        dark:bg-blue-950/30
                        dark:text-blue-400
                      "
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* =====================================================
              RIGHT SIDE IMAGE
          ===================================================== */}
          <div className="group relative flex items-center justify-center">

            {/* Pulse ring on hover */}
            <div
              className="
                absolute
                h-85 w-85
                rounded-full border-2 border-cyan-400/30
                opacity-0 transition-opacity duration-300
                group-hover:animate-pulse-ring group-hover:opacity-100
                sm:h-100 sm:w-100
                lg:h-120 lg:w-120
              "
            />

            {/* Bright glow ring */}
            <div
              className="
                absolute
                h-85 w-85
                rounded-full
                shadow-[0_0_40px_8px_rgba(6,182,212,0.3),0_0_80px_16px_rgba(6,182,212,0.15)]
                transition-all duration-500
                group-hover:shadow-[0_0_60px_12px_rgba(6,182,212,0.5),0_0_120px_24px_rgba(6,182,212,0.25)]
                sm:h-102.5 sm:w-102.5
                lg:h-120 lg:w-120
              "
            />

            {/* Background circle */}
            <div
              className="
                absolute animate-float
                h-85 w-85
                rounded-full bg-cyan-50
                border border-cyan-300/50
                transition-all duration-500
                group-hover:bg-cyan-100/80 group-hover:border-cyan-300 group-hover:shadow-xl group-hover:shadow-cyan-200/60
                sm:h-100 sm:w-100
                lg:h-120 lg:w-120
                dark:bg-cyan-950/40 dark:border-cyan-800/30 dark:group-hover:bg-cyan-900/50 dark:group-hover:border-cyan-700/50
              "
            />

            {/* Hero image */}
            <div
              className="
                relative z-10
                flex items-center justify-center
                overflow-hidden rounded-full
                animate-float-reverse
                transition-all duration-500
                hover:scale-110 hover:drop-shadow-2xl
                cursor-pointer
              "
            >
              <img
                src="/images/hero-removebg-preview.png"
                alt="Job seeker searching for job opportunities"
                className="
                  h-75 w-75 object-cover
                  transition-transform duration-500
                  sm:h-90 sm:w-90
                  lg:h-110 lg:w-110
                "
              />
            </div>

            {/* =================================================
                JOBS STAT CARD
            ================================================= */}
            <div
              className="
                absolute
                -left-4
                top-4
                z-20
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-xl
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1671B9] dark:bg-blue-950/50">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stats.totalJobs.toLocaleString()}+
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Job Opportunities
                </p>
              </div>
            </div>

            {/* =================================================
                COMPANIES STAT CARD
            ================================================= */}
            <div
              className="
                absolute
                -right-4
                top-10
                z-20
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-xl
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1671B9] dark:bg-blue-950/50">
                <Users size={22} />
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stats.totalCompanies.toLocaleString()}+
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Companies
                </p>
              </div>
            </div>

            {/* =================================================
                SUCCESS CARD
            ================================================= */}
            {stats.successRate !== undefined && (
              <div
                className="
                  absolute
                  -right-4
                  bottom-8
                  z-20
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  px-4
                  py-3
                  shadow-xl
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-2xl
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <span className="text-lg font-bold">
                    ✓
                  </span>
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {stats.successRate}%
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Success Rate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <TrustedCompaniesSection
  companies={data?.trustedCompanies ?? []}
/> 

        {/* =====================================================
            BENEFITS
        ===================================================== */}
        <div className="mt-16 grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">

          <Benefit
            icon="⚡"
            title="Easy to Use"
            description="Simple and intuitive job search experience"
          />

          <Benefit
            icon="🛡"
            title="Trusted Companies"
            description="Find opportunities from trusted companies"
          />

          <Benefit
            icon="◷"
            title="Fast Application"
            description="Apply to jobs in just a few clicks"
          />

          <Benefit
            icon="◎"
            title="Better Matches"
            description="Find jobs that match your skills"
          />

        </div>
      </div>
    </section>
  );
}

/* =============================================================
   BENEFIT
============================================================= */

function Benefit({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1671B9] text-lg text-white">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}