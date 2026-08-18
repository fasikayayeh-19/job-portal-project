'use client';
import { useJobs } from '@/hooks/useJobs';
import type { Job } from '@/services/jobs.service';
import DashboardToolbar from './DashboardToolbar';
import { useJobSeekerDashboard } from '@/hooks/useJobSeekerDashboard';
import type {
  RecentApplication,
  RecentSavedJob,
} from '@/services/job-seeker.service';




export default function JobSeekerDashboard() {
  const {
    data,
    isLoading,
    isError,
  } = useJobSeekerDashboard();

  const {
    data: jobsData,
    isLoading: jobsLoading,
  } = useJobs();



  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const { user, stats } = data;

  const name =
    user.firstName || user.lastName
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : user.email;

  return (
    <div className="space-y-6 pl-2">

      <DashboardToolbar user={user} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Job Seeker Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your job search and applications.
        </p>
      </div>

      <section className="rounded-2xl bg-[#1671B9] p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome back, {name} 👋
        </h2>

        <p className="mt-2 text-blue-100">
          Find your next opportunity and manage your applications.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Applications"
          value={stats.applications}
        />

        <DashboardCard
          title="Saved Jobs"
          value={stats.savedJobs}
        />

        <DashboardCard
          title="Interviews"
          value={stats.interviews}
        />

        <DashboardCard
          title="Profile"
          value={`${stats.profileComplete}%`}
        />

      </div>
      <RecentApplications
  applications={data.recentApplications}
/>

<RecentSavedJobs
  savedJobs={data.recentSavedJobs}
/>

<RecommendedJobs
  jobs={jobsData?.data ?? []}
  isLoading={jobsLoading}
/>

    </div>
  );
}


function RecommendedJobs({
  jobs,
  isLoading,
}: {
  jobs: Job[];
  isLoading: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recommended Jobs
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest opportunities you may be interested in
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-[#1671B9] hover:underline"
        >
          View all
        </button>

      </div>

      {isLoading ? (
        <RecommendedJobsSkeleton />
      ) : jobs.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          No jobs available right now.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">

          {jobs.map((job) => (
            <RecommendedJobRow
              key={job.id}
              job={job}
            />
          ))}

        </div>
      )}

    </section>
  );
}

function RecommendedJobRow({
  job,
}: {
  job: Job;
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="min-w-0">

        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
          {job.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {job.company.companyName}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            📍 {job.location}
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            💼 {job.jobType}
          </span>

        </div>

      </div>

      <button
        type="button"
        className="w-fit rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#125d99]"
      >
        View Job
      </button>

    </div>
  );
}


function RecommendedJobsSkeleton() {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse px-6 py-5"
        >
          <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-6 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}

    </div>
  );
}

function RecentSavedJobs({
  savedJobs,
}: {
  savedJobs: RecentSavedJob[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Saved Jobs
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Jobs you saved recently
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-[#1671B9] hover:underline"
        >
          View all
        </button>

      </div>

      {savedJobs.length === 0 ? (
        <EmptySavedJobs />
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">

          {savedJobs.map((savedJob) => (
            <SavedJobRow
              key={savedJob.id}
              savedJob={savedJob}
            />
          ))}

        </div>
      )}

    </section>
  );
}

function SavedJobRow({
  savedJob,
}: {
  savedJob: RecentSavedJob;
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="min-w-0">

        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
          {savedJob.job.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {savedJob.job.company.companyName}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Saved {formatDate(savedJob.createdAt)}
        </p>

      </div>

      <button
        type="button"
        className="w-fit rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#125d99]"
      >
        View Job
      </button>

    </div>
  );
}

function EmptySavedJobs() {
  return (
    <div className="px-6 py-10 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
        🔖
      </div>

      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
        No saved jobs
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Save jobs you're interested in and they will appear here.
      </p>

    </div>
  );
}

function ApplicationRow({
  application,
}: {
  application: RecentApplication;
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="min-w-0">

        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
          {application.job.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {application.job.company.companyName}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Applied {formatDate(application.createdAt)}
        </p>

      </div>

      <ApplicationStatus status={application.status} />

    </div>
  );
}

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

  const config = statusConfig[status] ?? {
    label: status,
    className:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function EmptyApplications() {
  return (
    <div className="px-6 py-10 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
        📄
      </div>

      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
        No applications yet
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Start applying to jobs and your applications will appear here.
      </p>

    </div>
  );
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

function RecentApplications({
  applications,
}: {
  applications: RecentApplication[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Applications
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your latest job applications
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-[#1671B9] hover:underline"
        >
          View all
        </button>

      </div>

      {applications.length === 0 ? (
        <EmptyApplications />
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">

          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
            />
          ))}

        </div>
      )}

    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />

      <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>

    </div>
  );
}