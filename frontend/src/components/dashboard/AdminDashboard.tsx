
import DashboardToolbar from './DashboardToolbar';

interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    role: 'ADMIN';

    firstName?: string;
    lastName?: string;
  };
}

export default function AdminDashboard({
  user,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">

      {/* =================================================
          Dashboard Toolbar
          Search + Notifications + Profile
      ================================================== */}

      <DashboardToolbar user={user} />

      {/* =================================================
          Dashboard Header
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
          Statistics
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Users"
          value="0"
        />

        <DashboardCard
          title="Companies"
          value="0"
        />

        <DashboardCard
          title="Jobs"
          value="0"
        />

        <DashboardCard
          title="Applications"
          value="0"
        />

      </div>

    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
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
