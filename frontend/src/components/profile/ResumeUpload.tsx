'use client';

import { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Loader2,
  Download,
} from 'lucide-react';

import {
  uploadResume,
  deleteResume,
} from '@/services/resume.service';

interface ResumeUploadProps {
  resumeUrl?: string;
  resumeFileName?: string;
  onUploaded: (
    url: string,
    fileName: string,
  ) => void;
  onDeleted: () => void;
}

export default function ResumeUpload({
  resumeUrl,
  resumeFileName,
  onUploaded,
  onDeleted,
}: ResumeUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        'Please upload a PDF, DOC, or DOCX file.',
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        'Resume must be smaller than 5MB.',
      );
      return;
    }

    try {
      setUploading(true);

      const result =
        await uploadResume(file);

      onUploaded(
        result.resumeUrl,
        result.resumeFileName,
      );
    } catch (error) {
      console.error(
        'Failed to upload resume:',
        error,
      );

      alert(
        'Failed to upload resume.',
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your resume?',
      )
    ) {
      return;
    }

    try {
      setDeleting(true);

      await deleteResume();

      onDeleted();
    } catch (error) {
      console.error(
        'Failed to delete resume:',
        error,
      );

      alert(
        'Failed to delete resume.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const fullResumeUrl = resumeUrl
    ? resumeUrl.startsWith('http')
      ? resumeUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`
    : '';

  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
          <FileText size={21} />
        </div>

        <div className="min-w-0 flex-1">

          <h3 className="font-semibold text-slate-900 dark:text-white">
            Resume
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload your resume so companies can review your qualifications.
          </p>

          {resumeFileName && (
            <p className="mt-3 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
              📄 {resumeFileName}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">

            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                inputRef.current?.click()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0F5F9E] disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {resumeUrl
                    ? 'Replace Resume'
                    : 'Upload Resume'}
                </>
              )}
            </button>

            {fullResumeUrl && (
              <a
                href={fullResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download size={16} />
                View Resume
              </a>
            )}

            {resumeUrl && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:hover:bg-red-950/20"
              >
                {deleting ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                Delete
              </button>
            )}

          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="mt-3 text-xs text-slate-400">
            PDF, DOC or DOCX · Maximum 5MB
          </p>

        </div>
      </div>
    </div>
  );
}