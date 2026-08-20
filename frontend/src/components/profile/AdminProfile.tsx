
'use client';

import { useEffect, useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, Save, Loader2,ca } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN';

  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  profileImageUrl?: string;
}

export default function AdminProfile() {
  const [user, setUser] = useState<AdminUser | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(
        storedUser,
      ) as AdminUser;

      setUser(parsedUser);

      setFirstName(parsedUser.firstName ?? '');
      setLastName(parsedUser.lastName ?? '');
      setPhone(parsedUser.phone ?? '');
      setLocation(parsedUser.location ?? '');
    } catch (error) {
      console.error(
        'Failed to load admin profile:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = e.target.files?.[0];

  if (!file || !user) {
    return;
  }

  try {
    const token =
      localStorage.getItem('accessToken');

    const formData = new FormData();

    formData.append('image', file);

    const response = await fetch(
      'http://localhost:3000/users/profile/image',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(
        'Failed to upload profile image',
      );
    }

    const updatedUser = await response.json();

    const newUser = {
      ...user,
      ...updatedUser,
    };

    setUser(newUser);

    localStorage.setItem(
      'user',
      JSON.stringify(newUser),
    );

    window.dispatchEvent(
      new Event('userUpdated'),
    );
  } catch (error) {
    console.error(
      'Profile image upload failed:',
      error,
    );
  }

  // Allow selecting the same image again
  e.target.value = '';
};

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage('');

    try {
      const token =
        localStorage.getItem('accessToken');

      const response = await fetch(
        `http://localhost:3000/users/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            location,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update profile',
        );
      }

      const updatedUser = await response.json();

      const newUser = {
        ...user,
        ...updatedUser,
      };

      localStorage.setItem(
        'user',
        JSON.stringify(newUser),
      );

      setUser(newUser);

      window.dispatchEvent(
        new Event('userUpdated'),
      );

      setMessage(
        'Profile updated successfully.',
      );
    } catch (error) {
      console.error(error);

      setMessage(
        'Failed to update profile.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          className="animate-spin text-[#1671B9]"
          size={28}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500">
          Unable to load admin profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your administrator profile information.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* Avatar */}
       <div className="mb-6 flex items-center gap-4">
  <div className="relative">

    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#1671B9]/10 text-[#1671B9]">
      {user.profileImageUrl ? (
        <img
          src={
            user.profileImageUrl.startsWith('http')
              ? user.profileImageUrl
              : `http://localhost:3000${user.profileImageUrl}`
          }
          alt="Admin profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <UserCircle size={42} />
      )}
    </div>

    {/* Upload button */}
    <label
      htmlFor="admin-profile-image"
      className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#1671B9] text-white shadow-md transition hover:bg-[#125f9d]"
      title="Change profile image"
    >
      <Camera size={14} />
    </label>

    <input
      id="admin-profile-image"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      className="hidden"
      onChange={handleImageUpload}
    />
  </div>

  <div>
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
      {firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : 'Administrator'}
    </h2>

    <p className="text-sm text-slate-500 dark:text-slate-400">
      Administrator
    </p>
  </div>
</div>

        {/* Form */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* First name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              First Name
            </label>

            <input
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="First name"
            />
          </div>

          {/* Last name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Last Name
            </label>

            <input
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Last name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Mail size={15} />
              Email
            </label>

            <input
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Phone size={15} />
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Phone number"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MapPin size={15} />
              Location
            </label>

            <input
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Location"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            {message}
          </p>
        )}

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125f9d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}