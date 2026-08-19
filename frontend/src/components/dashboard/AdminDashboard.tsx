"use client";


import  { useAdminDashboard } from "@/hooks/useAdmin";
import api from "@/lib/axios";
interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    role: "ADMIN";
    firstName?: string;
    lastName?: string;
  };
}
export interface AdminDashboardData {
  totalUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  totalJobs: number;
  totalApplications: number;

  applicationStatus: {
    pendingReview: number;
    test: number;
    interview: number;
    hired: number;
    declined: number;
  };

  companyStatus: {
    pending: number;
    approved: number;
  };

  applicationsOverTime: {
    month: string;
    applications: number;
  }[];

  jobsByCategory: {
    category: string;
    jobs: number;
  }[];
}

export async function getAdminDashboardStats(): Promise<AdminDashboardData> {
  const response = await api.get("/admin/dashboard");

  return response.data;
}

export default function AdminDashboard({
  user,
}: AdminDashboardProps) {
  const {
    data,
    isLoading,
    isError,
  } = useAdminDashboard();

  const dashboardData = data as AdminDashboardData | undefined;

  return (
    <div className="space-y-6">

      {/* =================================================
          Dashboard Toolbar
      ================================================== */}


      {/* =================================================
          Header
      ================================================== */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage and monitor the Job Portal platform.
        </p>
      </div>

      {/* =================================================
          Welcome
      ================================================== */}
      <section className="rounded-2xl bg-[#1671B9] p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome, Administrator 👋
        </h2>

        <p className="mt-2 text-blue-100">
          Here is an overview of your Job Portal system.
        </p>
      </section>

      {/* =================================================
          Error
      ================================================== */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Unable to load admin dashboard statistics.
        </div>
      )}

      {/* =================================================
          Statistics
      ================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Users"
          value={dashboardData?.totalUsers ?? 0}
          loading={isLoading}
        />

        <DashboardCard
          title="Companies"
          value={dashboardData?.totalCompanies ?? 0}
          loading={isLoading}
        />

        <DashboardCard
          title="Jobs"
          value={dashboardData?.totalJobs ?? 0}
          loading={isLoading}
        />

        <DashboardCard
          title="Applications"
          value={dashboardData?.totalApplications ?? 0}
          loading={isLoading}
        />

      </div>

      {/* =================================================
          Overview
      ================================================== */}
      <div className="grid gap-6 lg:grid-cols-2">

        <OverviewCard
          title="Company Overview"
          items={[
            {
              label: "Approved Companies",
              value: dashboardData?.approvedCompanies ?? 0,
            },
            {
              label: "Pending Companies",
              value: dashboardData?.pendingCompanies ?? 0,
            },
          ]}
          loading={isLoading}
        />

        <OverviewCard
          title="Platform Overview"
          items={[
            {
              label: "Total Users",
              value: dashboardData?.totalUsers ?? 0,
            },
            {
              label: "Total Jobs",
              value: dashboardData?.totalJobs ?? 0,
            },
            {
              label: "Applications",
              value: dashboardData?.totalApplications ?? 0,
            },
          ]}
          loading={isLoading}
        />

      </div>

      {/* =================================================
          Charts / Status
      ================================================== */}
      {!isLoading && !isError && dashboardData && (
        <>
          <AdminCharts data={dashboardData} />

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Applications Over Time
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Monthly application activity
                </p>
              </div>

              {dashboardData.applicationsOverTime &&
              dashboardData.applicationsOverTime.length > 0 ? (
                <ApplicationOverTimeChart
                  data={dashboardData.applicationsOverTime}
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No application activity yet.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Jobs by Category
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Number of jobs posted in each category
                </p>
              </div>

              {dashboardData.jobsByCategory &&
              dashboardData.jobsByCategory.length > 0 ? (
                <JobsByCategoryChart
                  data={dashboardData.jobsByCategory}
                />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No jobs by category available.
                  </p>
                </div>
              )}
            </section>
          </div>
        </>
      )}

    </div>
  );
}

function ApplicationOverTimeChart({
  data,
}: {
  data: {
    month: string;
    applications: number;
  }[];
}) {
  const chartData = buildMonthlyChartData(data);
  const maxValue = Math.max(
    ...chartData.map((item) => item.applications),
    1,
  );

  const yAxisTicks = Array.from({ length: 5 }, (_, index) => {
    const value = Math.round((maxValue / 4) * (4 - index));
    return value;
  });

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Y-Axis – hidden on mobile */}
        <div className="hidden h-56 w-10 shrink-0 flex-col justify-between pb-8 pt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 md:flex md:w-12">
          {yAxisTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-2 h-48 border-l border-b border-slate-300 dark:border-slate-700 md:h-52" />

          <div className="absolute inset-x-0 top-2 hidden h-48 grid-cols-4 gap-0 md:h-52 lg:grid">
            {yAxisTicks.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className="border-t border-slate-200/80 dark:border-slate-700/80"
              />
            ))}
          </div>

          <div className="flex h-56 items-end gap-1 overflow-x-auto pb-8 pt-2 scrollbar-thin sm:h-64 sm:gap-1.5 md:gap-2 lg:gap-3">
            {chartData.map((item) => {
              const height =
                item.applications === 0
                  ? 4
                  : Math.max(
                      (item.applications / maxValue) * 100,
                      8,
                    );

              const formattedMonth = formatChartMonth(
                item.month,
              );

              return (
                <div
                  key={item.month}
                  className="flex w-8 min-w-8 flex-col items-center justify-end sm:w-10 sm:min-w-10 md:w-12 md:min-w-12"
                >
                  <span className="mb-1.5 text-[9px] font-semibold text-slate-600 dark:text-slate-300 sm:mb-2 sm:text-[10px] md:text-[11px]">
                    {item.applications}
                  </span>

                  <div className="flex h-36 w-full items-end rounded-t-md bg-slate-100 dark:bg-slate-800 sm:h-40 sm:rounded-t-lg md:h-44">
                    <div
                      className="w-full rounded-t-md bg-[#1671B9] transition-all duration-700 sm:rounded-t-lg"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="mt-2 text-[8px] font-medium text-slate-500 dark:text-slate-400 sm:text-[9px] md:text-[11px]">
                    {formattedMonth}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between px-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[10px] md:pl-12 lg:pl-14">
        <span className="hidden -rotate-90 transform md:inline" aria-label="Y-axis label">
          Applications
        </span>
        <span className="ml-auto">Month</span>
      </div>
    </div>
  );
}

function buildMonthlyChartData(
  source: { month: string; applications: number }[],
): { month: string; applications: number }[] {
  // Always show the last 12 months on the X-axis
  const today = new Date();
  const months: { month: string; applications: number }[] = [];

  // Build a lookup map from the source data
  const byMonth = new Map(
    source.map((item) => [item.month, item.applications]),
  );

  // Generate the last 12 months
  for (let index = 11; index >= 0; index -= 1) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - index,
      1,
    );

    const monthKey = toMonthKey(date);

    months.push({
      month: monthKey,
      applications: byMonth.get(monthKey) ?? 0,
    });
  }

  return months;
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatChartMonth(month: string) {
  const date = new Date(`${month}-01`);

  if (Number.isNaN(date.getTime())) {
    return month;
  }

  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "short",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  });
}
/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      {loading ? (
        <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
      ) : (
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {value.toLocaleString()}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   OVERVIEW CARD
========================================================= */

function OverviewCard({
  title,
  items,
  loading,
}: {
  title: string;
  items: {
    label: string;
    value: number;
  }[];
  loading?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
          >
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {item.label}
            </span>

            {loading ? (
              <div className="h-5 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white">
                {item.value.toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}

/* =========================================================
   ADMIN CHARTS / STATUS
========================================================= */

function AdminCharts({
  data,
}: {
  data: AdminDashboardData;
}) {
  const applicationStatus = data.applicationStatus ?? {
    pendingReview: 0,
    test: 0,
    interview: 0,
    hired: 0,
    declined: 0,
  };

  const companyStatus = data.companyStatus ?? {
    pending: data.pendingCompanies ?? 0,
    approved: data.approvedCompanies ?? 0,
  };

  const applicationItems = [
    {
      label: "Pending Review",
      value: applicationStatus.pendingReview,
      color: "bg-amber-500",
    },
    {
      label: "Test",
      value: applicationStatus.test,
      color: "bg-blue-500",
    },
    {
      label: "Interview",
      value: applicationStatus.interview,
      color: "bg-purple-500",
    },
    {
      label: "Hired",
      value: applicationStatus.hired,
      color: "bg-green-500",
    },
    {
      label: "Declined",
      value: applicationStatus.declined,
      color: "bg-red-500",
    },
  ];

  const companyItems = [
    {
      label: "Approved",
      value: companyStatus.approved,
      color: "bg-green-500",
    },
    {
      label: "Pending",
      value: companyStatus.pending,
      color: "bg-amber-500",
    },
  ];

  const maxApplicationValue = Math.max(
    ...applicationItems.map((item) => item.value),
    1,
  );

  const maxCompanyValue = Math.max(
    ...companyItems.map((item) => item.value),
    1,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* =================================================
          APPLICATION STATUS CHART
      ================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Applications by Status
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current application pipeline
          </p>
        </div>

        <div className="mt-8 space-y-6">

          {applicationItems.map((item) => {
            const percentage =
              item.value === 0
                ? 0
                : (item.value / maxApplicationValue) * 100;

            return (
              <div key={item.label}>

                {/* Label + Number */}

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                    />

                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>

                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </span>

                </div>

                {/* Bar */}

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>
      </section>


      {/* =================================================
          COMPANY STATUS CHART
      ================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Company Status
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Company approval overview
          </p>
        </div>

        {/* Total */}

        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Companies
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {companyStatus.approved + companyStatus.pending}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1671B9]/10 text-lg font-bold text-[#1671B9]">
            {companyStatus.approved + companyStatus.pending}
          </div>

        </div>

        {/* Company bars */}

        <div className="mt-7 space-y-6">

          {companyItems.map((item) => {
            const percentage =
              item.value === 0
                ? 0
                : (item.value / maxCompanyValue) * 100;

            return (
              <div key={item.label}>

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                    />

                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>

                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </span>

                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

        {/* Approval percentage */}

        <div className="mt-7 border-t border-slate-100 pt-5 dark:border-slate-800">

          <div className="flex items-center justify-between">

            <span className="text-sm text-slate-500 dark:text-slate-400">
              Approval Rate
            </span>

            <span className="text-sm font-bold text-green-600">
              {companyStatus.approved + companyStatus.pending > 0
                ? Math.round(
                    (companyStatus.approved /
                      (companyStatus.approved +
                        companyStatus.pending)) *
                      100,
                  )
                : 0}
              %
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}
/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span
            className={`h-3 w-3 rounded-full ${color}`}
          />

          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
          </span>

        </div>

        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {value.toLocaleString()}
        </span>

      </div>

    </div>
  );
}
function JobsByCategoryChart({
  data,
}: {
  data: {
    category: string;
    jobs: number;
  }[];
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.jobs),
    1,
  );

  return (
    <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
      {data.map((item) => {
        const percentage =
          item.jobs === 0
            ? 0
            : (item.jobs / maxValue) * 100;

        return (
          <div key={item.category}>
            <div className="mb-1.5 flex items-center justify-between gap-3 sm:mb-2 sm:gap-4">
              <span className="min-w-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
                {item.category}
              </span>

              <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                {item.jobs}
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:h-3">
              <div
                className="h-full rounded-full bg-[#1671B9] transition-all duration-700"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}