
'use client';

import {
  ChangeEvent,
  useRef,
  useState,
} from 'react';

import {
  Camera,
  Loader2,
} from 'lucide-react';

import api from '@/lib/axios';

interface CompanyLogoUploadProps {
  companyName: string;
  logoUrl?: string | null;
  onUploaded?: (url: string) => void;
}

export default function CompanyLogoUpload({
  companyName,
  logoUrl,
  onUploaded,
}: CompanyLogoUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState<string | null>(
      logoUrl || null,
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  const getImageUrl = (
    url?: string | null,
  ) => {
    if (!url) return null;

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {
      return url;
    }

    return `http://localhost:3000${url}`;
  };

  const initial =
    companyName
      ?.charAt(0)
      ?.toUpperCase() || 'C';

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError(
        'Please select an image file.',
      );

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Logo must be smaller than 5 MB.',
      );

      event.target.value = '';
      return;
    }

    const localPreview =
      URL.createObjectURL(file);

    setPreview(localPreview);

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        'logo',
        file,
      );

      const response =
        await api.post(
          '/companies/logo',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          },
        );

      const uploadedUrl =
        response.data?.logoUrl;

      if (!uploadedUrl) {
        throw new Error(
          'Logo URL was not returned by the server.',
        );
      }

      setPreview(
        getImageUrl(uploadedUrl),
      );

      onUploaded?.(
        uploadedUrl,
      );
    } catch (err: any) {
      console.error(
        'Company logo upload failed:',
        err,
      );

      setError(
        err.response?.data?.message ||
          'Failed to upload company logo.',
      );

      setPreview(
        getImageUrl(logoUrl),
      );
    } finally {
      setUploading(false);

      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">

      {/* Logo */}

      <div className="relative">

        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">

          {preview ? (
            <img
              src={preview}
              alt={`${companyName} logo`}
              className="h-full w-full object-contain p-2"
              onError={() =>
                setPreview(null)
              }
            />
          ) : (
            <span className="text-3xl font-bold text-[#1671B9]">
              {initial}
            </span>
          )}

        </div>

        {/* Camera button */}

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#1671B9] text-white shadow-md transition hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-900"
          aria-label="Change company logo"
        >
          {uploading ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Camera size={17} />
          )}
        </button>

      </div>

      {/* File input */}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleUpload}
        className="hidden"
      />

      <p className="text-xs text-slate-400">
        JPG, PNG or WebP · Max 5 MB
      </p>

      {error && (
        <p className="max-w-xs text-center text-xs text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}