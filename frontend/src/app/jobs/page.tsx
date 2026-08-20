"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import { useJobs } from "@/hooks/useJobs";
import { useCategories } from "@/hooks/useCategories";
import { useJobTypes } from "@/hooks/useJobTypes";
import SaveJobButton from "@/components/jobs/SaveJobButton";

import { useSavedJobs } from "@/hooks/useSavedJobs";

const BLUE = "#1671B9";
const TEAL = "#49BE8C";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  skills?: string[];
  location: string;
  jobType?: {
    id: string;
    name: string;
  };
  experience: string;
  salary?: string;
  deadline?: string;
  createdAt: string;

  company?: {
    id?: string;
    companyName?: string;
    logoUrl?: string;
    profileImageUrl?: string;
  };

  category?: {
    id: string;
    name: string;
  };
};

type JobsResponse = {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const postedOptions = [
  {
    value: "",
    label: "Any Time",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "yesterday",
    label: "Yesterday",
  },
  {
    value: "week",
    label: "Past Week",
  },
  {
    value: "month",
    label: "Past Month",
  },
];

export default function FindJobsPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [jobTypeId, setJobTypeId] = useState("");
  const [postedWithin, setPostedWithin] = useState("");

  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] = useState<"all" | "featured">("all");

  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const { data: jobTypes = [], isLoading: jobTypesLoading } = useJobTypes();

  const { data: savedJobs = [] } = useSavedJobs();

  const savedJobIds = useMemo(
    () => new Set(savedJobs.map((savedJob) => savedJob.job.id)),
    [savedJobs]
  );

  const { data, isLoading, isError } = useJobs({
    page,
    limit: 10,
    search,
    location,
    categoryId,
    jobTypeId,
    postedWithin,
  });

  // ...

  const jobsData = data as JobsResponse | undefined;

  const jobs = jobsData?.data ?? [];

  const totalPages = jobsData?.totalPages ?? 1;

  const displayedJobs = useMemo(() => {
    let result = [...jobs];

    if (activeTab === "featured") {
      result = result.filter(
        (job) => Boolean(job.salary) || Boolean(job.company?.companyName)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [jobs, activeTab, sortBy]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategoryId("");
    setLocation("");
    setJobTypeId("");
    setPostedWithin("");
    setPage(1);
  };

  const hasFilters =
    search || categoryId || location || jobTypeId || postedWithin;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* =====================================================
          HERO / SEARCH
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#006CA4] via-[#087FA4] to-[#0CABAE] px-4 py-12 sm:px-6 lg:px-10">
        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full border-[55px] border-white/20" />

        <div className="pointer-events-none absolute right-[-120px] top-[-80px] h-[400px] w-[400px] rounded-full border-[45px] border-white/10" />

        <div className="pointer-events-none absolute right-[18%] -bottom-36 h-[300px] w-[300px] rounded-full border-[35px] border-[#1671B9]/70" />

        <div className="relative mx-auto max-w-7xl px-4 pb-11 pt-12 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Find Your Dream Job in Ethiopia
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/85 sm:text-base">
            Discover opportunities from companies hiring across Ethiopia.
          </p>

          {/* Search */}

          <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-2 rounded-full bg-white p-1.5 shadow-xl sm:flex-row">
            <div className="flex flex-1 items-center px-4">
              <Search size={21} className="mr-3 shrink-0 text-slate-400" />

              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Job title, keywords or industry"
                className="h-11 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-base"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="h-11 rounded-full px-8 text-sm font-semibold text-white transition hover:brightness-95"
              style={{
                backgroundColor: BLUE,
              }}
            >
              Search
            </button>
          </div>

          {/* Filters */}

          <div className="mx-auto mt-7 flex max-w-6xl flex-wrap items-center justify-center gap-3">
            {/* Category */}

            <FilterSelect
              value={categoryId}
              onChange={(value) => {
                setCategoryId(value);
                setPage(1);
              }}
              icon={<BriefcaseBusiness size={16} />}
              placeholder="Category"
              options={[
                {
                  value: "",
                  label: "All Categories",
                },
                ...categories.map((category: any) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              loading={categoriesLoading}
            />

            {/* Location */}

            <FilterSelect
              value={location}
              onChange={(value) => {
                setLocation(value);
                setPage(1);
              }}
              icon={<MapPin size={16} />}
              placeholder="Location"
              options={[
                {
                  value: "",
                  label: "All Locations",
                },
                {
                  value: "Addis Ababa",
                  label: "Addis Ababa",
                },
                {
                  value: "Bahir Dar",
                  label: "Bahir Dar",
                },
                {
                  value: "Hawassa",
                  label: "Hawassa",
                },
                {
                  value: "Mekelle",
                  label: "Mekelle",
                },
                {
                  value: "Adama",
                  label: "Adama",
                },
                {
                  value: "Dire Dawa",
                  label: "Dire Dawa",
                },
              ]}
            />

            {/* Employment Type */}

            <FilterSelect
              value={jobTypeId}
              onChange={(value) => {
                setJobTypeId(value);
                setPage(1);
              }}
              icon={<BriefcaseBusiness size={16} />}
              placeholder="Employment Type"
              options={[
                {
                  value: "",
                  label: "All Types",
                },
                ...jobTypes.map((jt) => ({
                  value: jt.id,
                  label: jt.name,
                })),
              ]}
              loading={jobTypesLoading}
            />

            {/* Posted Within */}

            <FilterSelect
              value={postedWithin}
              onChange={(value) => {
                setPostedWithin(value);
                setPage(1);
              }}
              icon={<CalendarDays size={16} />}
              placeholder="Posted Within"
              options={postedOptions}
            />

            {/* Clear */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <RotateCcw size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_315px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="min-w-0">
            {/* Tabs + Sort */}

            <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`relative pb-4 text-sm font-semibold transition ${
                    activeTab === "all"
                      ? "text-[#49BE8C]"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  All Jobs
                  {activeTab === "all" && (
                    <span
                      className="absolute bottom-0 left-0 h-0.5 w-full"
                      style={{
                        backgroundColor: TEAL,
                      }}
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("featured")}
                  className={`relative pb-4 text-sm font-semibold transition ${
                    activeTab === "featured"
                      ? "text-[#49BE8C]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Featured Jobs
                  {activeTab === "featured" && (
                    <span
                      className="absolute bottom-0 left-0 h-0.5 w-full"
                      style={{
                        backgroundColor: TEAL,
                      }}
                    />
                  )}
                </button>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <SlidersHorizontal size={16} className="text-slate-400" />

                <span className="text-sm text-slate-400">Sort by</span>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as "date" | "title")
                  }
                  className="border-0 bg-transparent text-sm font-medium text-slate-600 outline-none dark:text-slate-300"
                >
                  <option value="date">Date</option>

                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            {/* Loading */}

            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <JobSkeleton key={item} />
                ))}
              </div>
            )}

            {/* Error */}

            {isError && !isLoading && (
              <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-900/50 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Unable to load jobs
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Please check your connection and try again.
                </p>
              </div>
            )}

            {/* Empty */}

            {!isLoading && !isError && displayedJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${TEAL}20`,
                  }}
                >
                  <Search
                    size={24}
                    style={{
                      color: TEAL,
                    }}
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
                  No jobs found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Try changing your search or filters to find more
                  opportunities.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                  style={{
                    backgroundColor: BLUE,
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Jobs */}

            {!isLoading &&
              !isError &&
              displayedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.some(
                    (savedJob) => savedJob.job.id === job.id
                  )}
                />
              ))}

            {/* Pagination */}

            {!isLoading && !isError && displayedJobs.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {/* Notice card */}

              <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-3xl">🚀</div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                  Get noticed faster
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Complete your profile and upload your resume to increase your
                  chances of getting noticed by employers.
                </p>

                <Link
                  href="/dashboard/profile"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                  style={{
                    backgroundColor: BLUE,
                  }}
                >
                  Update Profile
                </Link>
              </div>

              {/* Search tip */}

              <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Search size={20} className="text-slate-600" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  Level up your job search
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Use specific job titles, locations and employment types to
                  find opportunities that match your goals.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  icon,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
      )}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
        className={`h-11 min-w-[155px] appearance-none rounded-xl border border-white/50 bg-white/90 px-4 text-sm text-slate-600 shadow-sm outline-none transition hover:bg-white focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/20 dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-200 dark:hover:bg-slate-800 ${
          icon ? "pl-9" : "pl-4"
        }`}
      >
        {loading ? (
          <option value="">Loading...</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value ? option.label : placeholder}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

/* =========================================================
   JOB CARD
========================================================= */

function JobCard({ job, isSaved }: { job: Job; isSaved: boolean }) {
  const companyName = job.company?.companyName || "Company";

  const logo = job.company?.logoUrl || job.company?.profileImageUrl;

  const postedDate = new Date(job.createdAt);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="mb-5 block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 sm:p-7"
    >
      <article>
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
            <span style={{ color: TEAL }}>New</span>

            {job.salary && (
              <span className="font-medium" style={{ color: TEAL }}>
                Salary Available
              </span>
            )}

            <span className="font-medium" style={{ color: BLUE }}>
              ⚡ Easy Apply
            </span>
          </div>

          {/* Save button */}
          <div
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <SaveJobButton jobId={job.id} isSaved={isSaved} />
          </div>
        </div>

        {/* Main */}
        <div className="mt-7 grid gap-6 md:grid-cols-[1fr_145px]">
          <div>
            {/* Category */}
            {job.category?.name && (
              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {job.category.name}
              </span>
            )}

            {/* Title */}
            <h2 className="mt-4 text-xl font-bold text-slate-950 transition dark:text-white sm:text-2xl">
              {job.title}
            </h2>

            {/* Company */}
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-700">
              {formatPostedDate(postedDate)}

              <span className="mx-1.5">by</span>

              <span className="font-medium" style={{ color: BLUE }}>
                {companyName}
              </span>
            </p>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-slate-500" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays size={17} className="text-slate-500" />

                {job.deadline
                  ? `Deadline ${new Date(job.deadline).toLocaleDateString()}`
                  : "Open until filled"}
              </span>

              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={17} className="text-slate-500" />

                {job.jobType?.name || "Not specified"}
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              {job.description}
            </p>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Company Logo */}
          <div className="flex items-start justify-center md:pt-2">
            <CompanyLogo logo={logo} companyName={companyName} />
          </div>
        </div>
      </article>
    </Link>
  );
}

function CompanyLogo({
  logo,
  companyName,
}: {
  logo?: string | null;
  companyName: string;
}) {
  const [failed, setFailed] = useState(false);

  const getLogoUrl = (value: string) => {
    // Already a complete URL
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    // Backend already returns /uploads/...
    if (value.startsWith("/")) {
      return `http://localhost:3000${value}`;
    }

    // Backend returns uploads/... without /
    return `http://localhost:3000/${value}`;
  };

  if (!logo || failed) {
    return (
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-2xl font-bold"
        style={{
          color: BLUE,
        }}
      >
        {companyName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
      <img
        src={getLogoUrl(logo)}
        alt={`${companyName} logo`}
        className="h-full w-full object-contain"
        onError={() => {
          setFailed(true);
        }}
      />
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#1671B9] hover:text-[#1671B9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from(
        {
          length: Math.min(totalPages, 5),
        },
        (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                page === pageNumber
                  ? "text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#1671B9] hover:text-[#1671B9]"
              }`}
              style={
                page === pageNumber
                  ? {
                      backgroundColor: BLUE,
                    }
                  : undefined
              }
            >
              {pageNumber}
            </button>
          );
        }
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#1671B9] hover:text-[#1671B9] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function JobSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-4 w-32 rounded bg-slate-200" />

      <div className="mt-7 h-7 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />

      <div className="mt-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />

      <div className="mt-6 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatPostedDate(date: Date) {
  const diff = Date.now() - date.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return "Just now";
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString();
}
