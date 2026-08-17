'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import {
  useSaveJob,
  useRemoveSavedJob,
} from '@/hooks/useSavedJobs';

interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
}

const BLUE = '#1671B9';

export default function SaveJobButton({
  jobId,
  isSaved,
}: SaveJobButtonProps) {
  const saveMutation = useSaveJob();
  const removeMutation = useRemoveSavedJob();

  const isLoading =
    saveMutation.isPending ||
    removeMutation.isPending;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isSaved) {
      removeMutation.mutate(jobId);
    } else {
      saveMutation.mutate(jobId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={
        isSaved
          ? 'Remove from saved jobs'
          : 'Save job'
      }
      title={
        isSaved
          ? 'Remove from saved jobs'
          : 'Save job'
      }
      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
        isSaved
          ? 'border-[#1671B9]/30 bg-[#1671B9]/10 text-[#1671B9]'
          : 'border-slate-200 bg-white text-slate-500 hover:border-[#1671B9]/30 hover:bg-[#1671B9]/5 hover:text-[#1671B9]'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {isSaved ? (
        <BookmarkCheck size={19} />
      ) : (
        <Bookmark size={19} />
      )}
    </button>
  );
}