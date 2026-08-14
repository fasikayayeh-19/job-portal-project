'use client';

import DashboardToolbar from './DashboardToolbar';
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  FileText,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import CompanyApplicationChart from '@/components/dashboard/CompanyApplicationChart';
import { useCompanyDashboard } from '@/hooks/useCompanyDashboard';
interface CompanyDashboardProps {
  user: {
    id: string;
    email: string;
    role: 'COMPANY';

    firstName?: string;
    lastName?: string;

    company?: {
      companyName: string;
    };
  };
}

export default function CompanyDashboard({
  user,
}: CompanyDashboardProps) {

  const {
    data,
    isLoading,
    isError,
  } = useCompanyDashboard();

  const companyName =
    data?.company?.companyName ||
    user.company?.companyName ||
    'Your Company';



      if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading company dashboard...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
        Failed to load company dashboard.
      </div>
    );
  }
  // ============================================
  // Temporary dashboard data
  // Later these will come from the backend
  // ============================================

  const statistics = {
    activeJobs: 12,
    totalJobs: 18,
    applications: 148,
    newApplicants: 32,
  };

  const applicationStatus = [
    {
      label: 'Pending Review',
      value: 45,
    },
    {
      label: 'On Test',
      value: 30,
    },
    {
      label: 'Interview',
      value: 25,
    },
    {
      label: 'Hired',
      value: 18,
    },
    {
      label: 'Declined',
      value: 30,
    },
  ];

  const applicationsOverTime = [
    { day: 'Mon', value: 18 },
    { day: 'Tue', value: 25 },
    { day: 'Wed', value: 20 },
    { day: 'Thu', value: 32 },
    { day: 'Fri', value: 28 },
    { day: 'Sat', value: 35 },
    { day: 'Sun', value: 42 },
  ];

  const jobPerformance = [
    {
      title: 'Frontend Developer',
      applications: 45,
    },
    {
      title: 'Backend Developer',
      applications: 32,
    },
    {
      title: 'UI/UX Designer',
      applications: 24,
    },
    {
      title: 'QA Engineer',
      applications: 15,
    },
  ];

  const recentApplicants = [
    {
      name: 'John Doe',
      job: 'Frontend Developer',
      status: 'INTERVIEW',
      date: 'Aug 12, 2026',
    },
    {
      name: 'Sarah Ahmed',
      job: 'Backend Developer',
      status: 'PENDING_REVIEW',
      date: 'Aug 11, 2026',
    },
    {
      name: 'Michael Brown',
      job: 'UI/UX Designer',
      status: 'ON_TEST',
      date: 'Aug 10, 2026',
    },
    {
      name: 'Emily Wilson',
      job: 'Frontend Developer',
      status: 'HIRED',
      date: 'Aug 09, 2026',
    },
  ];

  return (
    <div className="space-y-6">

      {/* =================================================
          Dashboard Toolbar
      ================================================== */}

      <DashboardToolbar user={user} />

      {/* =================================================
          Dashboard Header
      ================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Company Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your company, jobs, and applicants.
        </p>
      </div>

      {/* =================================================
          Welcome
      ================================================== */}

      <section className="rounded-2xl bg-[#1671B9] p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome, {companyName} 👋
        </h2>

        <p className="mt-2 text-blue-100">
          Manage your recruitment activities from here.
        </p>
      </section>

      {/* =================================================
          Statistics
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
<DashboardCard
  title="Active Jobs"
  value={String(data?.stats.activeJobs ?? 0)}
  icon={<BriefcaseBusiness size={20} />}
/>

<DashboardCard
  title="Applications"
  value={String(data?.stats.applications ?? 0)}
  icon={<FileText size={20} />}
/>

<DashboardCard
  title="Shortlisted"
  value={String(data?.stats.shortlisted ?? 0)}
  icon={<UserCheck size={20} />}
/>

<DashboardCard
  title="Hired"
  value={String(data?.stats.hired ?? 0)}
  icon={<UserPlus size={20} />}
/>

<div className="grid gap-6 lg:grid-cols-2">
  <CompanyApplicationChart
    data={data?.applicationStatus}
  />
</div>

      </div>

      {/* =================================================
          Charts
      ================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Applications Over Time */}

        <ApplicationsChart
          data={applicationsOverTime}
        />

        {/* Application Status */}

        <ApplicationStatusChart
          data={applicationStatus}
        />

      </div>

      {/* =================================================
          Job Performance
      ================================================== */}

      <JobPerformance
        jobs={jobPerformance}
      />

      {/* =================================================
          Recent Applicants
      ================================================== */}

      <RecentApplicants
        applicants={recentApplicants}
      />

    </div>
  );
}

/* =====================================================
   STATISTICS CARD
===================================================== */

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   APPLICATIONS OVER TIME
===================================================== */

function ApplicationsChart({
  data,
}: {
  data: {
    day: string;
    value: number;
  }[];
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.value),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Applications Over Time
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Applications received this week
          </p>
        </div>

        <TrendingUp
          size={20}
          className="text-[#1671B9]"
        />

      </div>

      <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">

        {data.map((item) => {

          const height =
            (item.value / maxValue) * 100;

          return (
            <div
              key={item.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.value}
              </span>

              <div className="flex h-full w-full items-end">

                <div
                  className="w-full rounded-t-lg bg-[#1671B9] transition-all hover:bg-[#0F5F9E]"
                  style={{
                    height: `${height}%`,
                  }}
                />

              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.day}
              </span>

            </div>
          );
        })}

      </div>

    </section>
  );
}

/* =====================================================
   APPLICATION STATUS
===================================================== */

function ApplicationStatusChart({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Application Status
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Current recruitment pipeline
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">

        {/* Circle */}

        <div
          className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              'conic-gradient(#1671B9 0deg 110deg, #38A1DB 110deg 190deg, #7C3AED 190deg 250deg, #22C55E 250deg 295deg, #EF4444 295deg 360deg)',
          }}
        >

          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">

            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {total}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Applications
            </span>

          </div>

        </div>

        {/* Legend */}

        <div className="w-full space-y-3">

          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >

              <span className="text-slate-600 dark:text-slate-300">
                {item.label}
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {item.value}
              </span>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

/* =====================================================
   JOB PERFORMANCE
===================================================== */

function JobPerformance({
  jobs,
}: {
  jobs: {
    title: string;
    applications: number;
  }[];
}) {
  const maxApplications = Math.max(
    ...jobs.map((job) => job.applications),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Job Performance
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Applications received for each job
        </p>
      </div>

      <div className="mt-6 space-y-5">

        {jobs.map((job) => {

          const width =
            (job.applications /
              maxApplications) *
            100;

          return (
            <div key={job.title}>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {job.title}
                </span>

                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {job.applications}
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                <div
                  className="h-full rounded-full bg-[#1671B9]"
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

/* =====================================================
   RECENT APPLICANTS
===================================================== */

function RecentApplicants({
  applicants,
}: {
  applicants: {
    name: string;
    job: string;
    status: string;
    date: string;
  }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Applicants
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest candidates who applied to your jobs
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-[#1671B9] hover:underline"
        >
          View all
        </button>

      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">

        {applicants.map((applicant) => (

          <div
            key={`${applicant.name}-${applicant.date}`}
            className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#1671B9] dark:bg-blue-950/30">
                {applicant.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {applicant.name}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {applicant.job}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <span className="text-xs text-slate-400">
                {applicant.date}
              </span>

              <ApplicationStatus
                status={applicant.status}
              />

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

/* =====================================================
   APPLICATION STATUS BADGE
===================================================== */

function ApplicationStatus({
  status,
}: {
  status: string;
}) {
  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PENDING_REVIEW: {
      label: 'Pending Review',
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },

    ON_TEST: {
      label: 'On Test',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },

    INTERVIEW: {
      label: 'Interview',
      className:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },

    HIRED: {
      label: 'Hired',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },

    DECLINED: {
      label: 'Declined',
      className:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const config =
    statusConfig[status] ?? {
      label: status,
      className:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}