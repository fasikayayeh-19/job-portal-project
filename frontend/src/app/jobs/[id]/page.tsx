'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Send,
} from 'lucide-react';

import { useJob } from '@/hooks/useJobs';
import {
  useSavedJobs,
  useSaveJob,
  useRemoveSavedJob,
} from '@/hooks/useSavedJobs';

const BLUE = '#1671B9';
const TEAL = '#49BE8C';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = String(params.id);

  const {
    data: job,
    isLoading,
    isError,
  } = useJob(jobId);

  const { data: savedJobs = [] } =
    useSavedJobs();

  const saveMutation = useSaveJob();
  const removeMutation = useRemoveSavedJob();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse rounded-2xl bg-white p-8 shadow-sm">
            <div className="h-8 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-8 h-32 rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !job) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Job not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This job may have been closed or removed.
          </p>

          <Link
            href="/jobs"
            className="mt-6 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            style={{
              backgroundColor: BLUE,
            }}
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  const isSaved = savedJobs.some(
    (saved) => saved.job.id === job.id,
  );

  const companyName =
    job.company?.companyName || 'Company';

  const logo =
    job.company?.logoUrl ||
    job.company?.profileImageUrl;

  const handleSave = () => {
    if (isSaved) {
      removeMutation.mutate(job.id);
    } else {
      saveMutation.mutate(job.id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <section
        className="border-b"
        style={{
          background:
            'linear-gradient(135deg, #006CA4 0%, #087FA4 55%, #0CABAE 100%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>

          <div className="mt-6 flex items-center gap-5">

            <CompanyLogo
  logo={
    job.company?.logoUrl ||
    job.company?.profileImageUrl
  }
  companyName={
    job.company?.companyName || 'Company'
  }
/>

            <div className="min-w-0">

              {job.category?.name && (
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  {job.category.name}
                </span>
              )}

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {job.title}
              </h1>

              <p className="mt-1 text-sm text-white/80">
                {companyName}
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* OVERVIEW */}

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Job Overview
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={job.location}
                />

                <InfoItem
                  icon={<BriefcaseBusiness size={18} />}
                  label="Employment Type"
                  value={formatJobType(job.jobType)}
                />

                <InfoItem
                  icon={<CheckCircle2 size={18} />}
                  label="Experience"
                  value={job.experience || 'Not specified'}
                />

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Deadline"
                  value={
                    job.deadline
                      ? new Date(
                          job.deadline,
                        ).toLocaleDateString()
                      : 'Open until filled'
                  }
                />

              </div>
            </div>

            {/* DESCRIPTION */}

            <ContentSection title="Job Description">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </ContentSection>

            {/* REQUIREMENTS */}

            {job.requirements && (
              <ContentSection title="Requirements">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {job.requirements}
                </p>
              </ContentSection>
            )}

            {/* SKILLS */}

            {job.skills &&
              job.skills.length > 0 && (
                <ContentSection title="Required Skills">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg px-3 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: `${TEAL}15`,
                          color: '#16805E',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </ContentSection>
              )}

          </div>

          {/* RIGHT */}

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <p className="text-sm font-medium text-slate-500">
                  Apply for this position
                </p>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    saveMutation.isPending ||
                    removeMutation.isPending
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50"
                  style={{
                    color: isSaved
                      ? BLUE
                      : '#64748b',
                  }}
                >
                  {isSaved ? (
                    <BookmarkCheck size={19} />
                  ) : (
                    <Bookmark size={19} />
                  )}
                </button>

              </div>

              {job.salary && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Salary
                  </p>

                  <p
                    className="mt-1 text-lg font-bold"
                    style={{
                      color: TEAL,
                    }}
                  >
                    {job.salary}
                  </p>
                </div>
              )}

              ```tsx
<button
  type="button"
  onClick={handleApply}
  disabled={
    !isJobSeeker ||
    alreadyApplied ||
    applyJob.isPending ||
    applicationsLoading
  }
  className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition ${
    alreadyApplied
      ? 'cursor-not-allowed bg-green-100 text-green-700'
      : 'bg-[#1671B9] text-white hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-50'
  }`}
>
  {applyJob.isPending
    ? 'Applying...'
    : alreadyApplied
      ? '✓ Applied'
      : 'Apply Now'}
</button>
```


              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Sign in as a job seeker to apply for this position.
              </p>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400">
                  Posted
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatPostedDate(
                    new Date(job.createdAt),
                  )}
                </p>
              </div>

            </div>
          </aside>

        </div>
      </section>
    </main>
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

  if (!logo || failed) {
    return (
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold shadow-sm"
        style={{
          color: BLUE,
        }}
      >
        {companyName.charAt(0).toUpperCase()}
      </div>
    );
  }

  const src = logo.startsWith('http')
    ? logo
    : `http://localhost:3000${logo}`;

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
      <img
        src={src}
        alt={`${companyName} logo`}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `${TEAL}15`,
          color: TEAL,
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>

    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}

function formatJobType(value?: string) {
  if (!value) {
    return 'Not specified';
  }

  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatPostedDate(date: Date) {
  const diff =
    Date.now() - date.getTime();

  const hours = Math.floor(
    diff / (1000 * 60 * 60),
  );

  if (hours < 1) {
    return 'Just now';
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? 'hour' : 'hours'
    } ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${
      days === 1 ? 'day' : 'days'
    } ago`;
  }

  return date.toLocaleDateString();
}