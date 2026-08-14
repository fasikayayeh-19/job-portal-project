'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CompanyApplicationChartProps {
  data?: {
    pendingReview: number;
    onTest: number;
    interview: number;
    hired: number;
    declined: number;
  };
}

export default function CompanyApplicationChart({
  data,
}: CompanyApplicationChartProps) {
  const chartData = [
    {
      name: 'Pending Review',
      value: data?.pendingReview ?? 0,
    },
    {
      name: 'On Test',
      value: data?.onTest ?? 0,
    },
    {
      name: 'Interview',
      value: data?.interview ?? 0,
    },
    {
      name: 'Hired',
      value: data?.hired ?? 0,
    },
    {
      name: 'Declined',
      value: data?.declined ?? 0,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Application Status
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of your applicants by status.
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={3}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}