'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface ProfileImageUploadProps {
  name: string;
  imageUrl?: string;
  onUploaded: (url: string) => void;
}

export default function ProfileImageUpload({
  name,
  imageUrl,
  onUploaded,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('file', file);

      const response = await api.post(
        '/users/profile-image',
        formData,
      );

      const uploadedUrl =
        response.data.profileImageUrl;

      onUploaded(uploadedUrl);
    } catch (error) {
      console.error(
        'Failed to upload profile image:',
        error,
      );

      alert('Failed to upload profile image.');
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const fullImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
    : '';

  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#1671B9] text-3xl font-bold text-white shadow-lg">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1671B9] shadow-md transition hover:bg-slate-100 disabled:opacity-50"
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

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-slate-500">
        JPG, PNG or WebP · Max 5MB
      </p>
    </div>
  );
}