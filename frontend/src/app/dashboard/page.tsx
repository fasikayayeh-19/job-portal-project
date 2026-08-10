import DashboardLayout from '../../components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your Job Portal account
          </p>
        </div>

        {/* Welcome */}
        <section
          className="
            rounded-2xl
            bg-[#1671B9]
            p-6
            text-white
            shadow-lg
          "
        >
          <h2 className="text-2xl font-bold">
            Welcome back 👋
          </h2>

          <p className="mt-2 text-blue-100">
            Here is your Job Portal overview.
          </p>
        </section>

        {/* Cards */}
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
            title="Notifications"
            value="0"
          />

          <DashboardCard
            title="Profile"
            value="Complete"
          />

        </div>

      </div>

    </DashboardLayout>
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
    <div
      className="
        rounded-xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-md
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}