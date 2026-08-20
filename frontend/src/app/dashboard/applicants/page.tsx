'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Users,
  FileText,
  ExternalLink,
  Save,
  Loader2,
} from 'lucide-react';

import {
  useCompanyApplicants,
  useUpdateApplicationStatus,
  useUpdateApplicationNote,
} from '@/hooks/useCompanyApplicants';

import type {
  CompanyApplicant,
  ApplicationStatus,
} from '@/services/applications.service';

export default function ApplicantsPage() {
  
  const {
    data: applicants = [],
    isLoading,
    isError,
  } = useCompanyApplicants();

  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
const jobFromUrl = searchParams.get('job');
 const [jobFilter, setJobFilter] = useState(
  jobFromUrl ?? 'ALL',
);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedApplicant, setSelectedApplicant] =
    useState<CompanyApplicant | null>(null);

  const [note, setNote] = useState('');

  const updateStatus = useUpdateApplicationStatus();
  const updateNote = useUpdateApplicationNote();
  
  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const jobs = useMemo(() => {
    return Array.from(
      new Map(
        applicants.map((item) => [
          item.job.id,
          item.job.title,
        ]),
      ).entries(),
    );
  }, [applicants]);

  const categories = useMemo(() => {
    return Array.from(
      new Map(
        applicants
          .filter((item) => item.job.category)
          .map((item) => [
            item.job.category!.id,
            item.job.category!.name,
          ]),
      ).entries(),
    );
  }, [applicants]);

  const jobTypes = useMemo(() => {
    return Array.from(
      new Set(
        applicants
          .map((item) => item.job.jobType)
          .filter(Boolean),
      ),
    );
  }, [applicants]);

  // =====================================================
  // FILTER APPLICANTS
  // =====================================================

  const filteredApplicants = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return applicants.filter((application) => {
      const fullName =
  `${application.seeker?.firstName ?? ''} ${
    application.seeker?.lastName ?? ''
  }`.toLowerCase();

const email =
  application.seeker?.email?.toLowerCase() ?? '';

const jobTitle =
  application.job?.title?.toLowerCase() ?? '';

const matchesSearch =
  !searchValue ||
  fullName.includes(searchValue) ||
  email.includes(searchValue) ||
  jobTitle.includes(searchValue);

      const matchesJob =
        jobFilter === 'ALL' ||
        application.job.id === jobFilter;

      const matchesCategory =
        categoryFilter === 'ALL' ||
        application.job.category?.id === categoryFilter;

      const matchesJobType =
        jobTypeFilter === 'ALL' ||
        application.job.jobType === jobTypeFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesJob &&
        matchesCategory &&
        matchesJobType &&
        matchesStatus
      );
    });
  }, [
    applicants,
    search,
    jobFilter,
    categoryFilter,
    jobTypeFilter,
    statusFilter,
  ]);

  // =====================================================
  // GROUP BY JOB
  // =====================================================

  const groupedApplicants = useMemo(() => {
  const groups = new Map<
    string,
    {
      id: string;
      title: string;
      jobType?: string;
      category?: string;
      applicants: CompanyApplicant[];
    }
  >();

  filteredApplicants.forEach((application) => {
    const jobId = application.job.id;

    if (!groups.has(jobId)) {
      groups.set(jobId, {
        id: jobId,
        title: application.job.title,
        jobType: application.job.jobType,
        category: application.job.category?.name,
        applicants: [],
      });
    }

    groups.get(jobId)!.applicants.push(application);
  });

  return Array.from(groups.values());
}, [filteredApplicants]);

  // =====================================================
  // OPEN APPLICANT
  // =====================================================

  const openApplicant = (
    applicant: CompanyApplicant,
  ) => {
    setSelectedApplicant(applicant);
    setNote(applicant.companyNote ?? '');
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    updateStatus.mutate({
      applicationId,
      status,
    });
  };

  // =====================================================
  // NOTE
  // =====================================================

  const handleSaveNote = () => {
    if (!selectedApplicant) return;

    updateNote.mutate({
      applicationId: selectedApplicant.id,
      note,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading applicants...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Failed to load applicants.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Applicants
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and manage applicants for your jobs.
        </p>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="grid gap-3 lg:grid-cols-5">

          {/* Search */}

          <div className="relative lg:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search applicants..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <FilterSelect
            value={jobFilter}
            onChange={setJobFilter}
            options={[
              ['ALL', 'All Jobs'],
              ...jobs.map(([id, title]) => [
                id,
                title,
              ]),
            ]}
          />

          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              ['ALL', 'All Categories'],
              ...categories.map(
                ([id, name]) => [id, name],
              ),
            ]}
          />

          <FilterSelect
            value={jobTypeFilter}
            onChange={setJobTypeFilter}
            options={[
              ['ALL', 'All Job Types'],
              ...jobTypes.map((type) => [
                type!,
                type!,
              ]),
            ]}
          />

          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              ['ALL', 'All Status'],
              ['PENDING_REVIEW', 'Pending Review'],
              ['TEST', 'On Test'],
              ['INTERVIEW', 'Interview'],
              ['HIRED', 'Hired'],
              ['DECLINED', 'Declined'],
            ]}
          />

        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Users size={16} />

          <span>
            {filteredApplicants.length} applicant
            {filteredApplicants.length !== 1
              ? 's'
              : ''}
          </span>
        </div>

      </section>

      {/* =================================================
          APPLICANTS BY JOB
      ================================================= */}

      {groupedApplicants.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <Users
            size={36}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">
            No applicants found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </section>
      ) : (
        <div className="space-y-6">

          {groupedApplicants.map((group) => (

            <section
              key={group.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >

              {/* Job Header */}

              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {group.title}
                    </h2>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">

                      {group.category && (
                        <span>
                          {group.category}
                        </span>
                      )}

                      {group.category &&
                        group.jobType && (
                          <span>•</span>
                        )}

                      {group.jobType && (
                        <span>
                          {group.jobType}
                        </span>
                      )}

                    </div>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1671B9] dark:bg-blue-950/30">
                    {group.applicants.length}{' '}
                    applicant
                    {group.applicants.length !== 1
                      ? 's'
                      : ''}
                  </span>

                </div>

              </div>

              {/* Applicants */}

              <div className="divide-y divide-slate-200 dark:divide-slate-800">

                {group.applicants.map(
                  (application) => {

                    const name =
                      `${application.seeker.firstName ?? ''} ${application.seeker.lastName ?? ''}`
                        .trim() ||
                      'Unnamed Applicant';

                    return (
                      <div
                        key={application.id}
                        className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                      >

                        <div className="flex items-center gap-4">

                          {/* Avatar */}

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#1671B9] dark:bg-blue-950/30">

                            {application.seeker
                              .profileImageUrl ? (
                              <img
                                src={
                                  application.seeker
                                    .profileImageUrl
                                }
                                alt={name}
                                className="h-11 w-11 rounded-full object-cover"
                              />
                            ) : (
                              name
                                .charAt(0)
                                .toUpperCase()
                            )}

                          </div>

                          {/* Info */}

                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {name}
                            </h3>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {application.seeker
                                .email}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Applied{' '}
                              {new Date(
                                application.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          {/* Status */}

                          <StatusSelect
                            value={
                              application.status
                            }
                            disabled={
                              updateStatus.isPending
                            }
                            onChange={(status) =>
                              handleStatusChange(
                                application.id,
                                status,
                              )
                            }
                          />

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              openApplicant(
                                application,
                              )
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-4 text-sm font-semibold text-white hover:bg-[#0F5F9E]"
                          >
                            View
                          </button>

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </section>

          ))}

        </div>
      )}

      {/* =================================================
          APPLICANT DETAILS MODAL
      ================================================= */}

      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          note={note}
          setNote={setNote}
          onClose={() =>
            setSelectedApplicant(null)
          }
          onSaveNote={handleSaveNote}
          savingNote={updateNote.isPending}
        />
      )}

    </div>
  );
}

// =====================================================
// FILTER SELECT
// =====================================================

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

// =====================================================
// STATUS SELECT
// =====================================================

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (
    value: ApplicationStatus,
  ) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(
            e.target.value as ApplicationStatus,
          )
        }
        className="h-10 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="PENDING_REVIEW">
          Pending Review
        </option>

        <option value="TEST">
          On Test
        </option>

        <option value="INTERVIEW">
          Interview
        </option>

        <option value="HIRED">
          Hired
        </option>

        <option value="DECLINED">
          Declined
        </option>
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

// =====================================================
// APPLICANT MODAL
// =====================================================

function ApplicantModal({
  applicant,
  note,
  setNote,
  onClose,
  onSaveNote,
  savingNote,
}: {
  applicant: CompanyApplicant;
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  onSaveNote: () => void;
  savingNote: boolean;
}) {
  const name =
    `${applicant.seeker.firstName ?? ''} ${applicant.seeker.lastName ?? ''}`
      .trim() || 'Unnamed Applicant';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {applicant.job.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            ×
          </button>

        </div>

        <div className="space-y-6 p-6">

          {/* Applicant Information */}

          <div className="grid gap-5 sm:grid-cols-2">

            <InfoItem
              label="Email"
              value={applicant.seeker.email}
            />

            <InfoItem
              label="Phone"
              value={
                applicant.seeker.phone ||
                'Not provided'
              }
            />

            <InfoItem
              label="Professional Title"
              value={
                applicant.seeker
                  .professionalTitle ||
                'Not provided'
              }
            />

            <InfoItem
              label="Job Type"
              value={
                applicant.job.jobType ||
                'Not specified'
              }
            />

            <InfoItem
              label="Category"
              value={
                applicant.job.category?.name ||
                'Not specified'
              }
            />

            <InfoItem
              label="Applied"
              value={new Date(
                applicant.createdAt,
              ).toLocaleDateString()}
            />

          </div>

          {/* Skills */}

          <InfoSection
            title="Skills"
            value={
              applicant.seeker.skills ||
              'No skills provided.'
            }
          />

          {/* Experience */}

          <InfoSection
            title="Experience"
            value={
              applicant.seeker.experience ||
              'No experience provided.'
            }
          />

          {/* Education */}

          <InfoSection
            title="Education"
            value={
              applicant.seeker.education ||
              'No education information provided.'
            }
          />

          {/* Cover Letter */}

          <InfoSection
            title="Cover Letter"
            value={
              applicant.coverLetter ||
              'No cover letter provided.'
            }
          />

          {/* Resume */}


{applicant.seeker.resumeUrl && (
  <div>
    <h3 className="mb-3 text-sm font-semibold text-slate-900">
      Resume
    </h3>

    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <iframe
        src={
          applicant.seeker.resumeUrl.startsWith('http')
            ? applicant.seeker.resumeUrl
            : `${window.location.origin}${applicant.seeker.resumeUrl}`
        }
        title={`${applicant.seeker.firstName ?? 'Applicant'} Resume`}
        className="h-[700px] w-full"
      />
    </div>
  </div>
)}



          

          {/* Private Note */}

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">

            <div className="mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Private Company Note
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                This note is only visible to your company.
              </p>
            </div>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              rows={5}
              placeholder="Write your private notes about this candidate..."
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div className="mt-3 flex justify-end">

              <button
                type="button"
                disabled={savingNote}
                onClick={onSaveNote}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F5F9E] disabled:opacity-60"
              >
                {savingNote ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                {savingNote
                  ? 'Saving...'
                  : 'Save Note'}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// INFO SECTION
// =====================================================

function InfoSection({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {value}
      </div>
    </div>
  );
}