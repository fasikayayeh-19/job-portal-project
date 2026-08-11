interface JobSeekerDashboardProps {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export default function JobSeekerDashboard({
  user,
}: JobSeekerDashboardProps) {
  const name =
    user.firstName ||
    user.lastName
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : user.email;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Job Seeker Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your job search and applications.
        </p>
      </div>

      {/* Welcome */}
      <section className="rounded-2xl bg-[#1671B9] p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome back, {name} 👋
        </h2>

        <p className="mt-2 text-blue-100">
          Find your next opportunity and manage your applications.
        </p>
      </section>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Applications"
          value="0"
        />

        <DashboardCard
          title="Saved Jobs"
          value="0"
        />

        <DashboardCard
          title="Interviews"
          value="0"
        />

        <DashboardCard
          title="Profile"
          value="Complete"
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}