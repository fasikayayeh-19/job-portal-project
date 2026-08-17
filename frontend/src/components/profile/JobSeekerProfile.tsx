'use client';
import ProfileImageUpload from '@/components/profile/ProfileImageUpload';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUpload from '@/components/profile/ResumeUpload';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Briefcase,
  Save,
  Loader2,
} from 'lucide-react';



import api from '@/lib/axios';

interface UserProfile {
  id: string;
  email: string;

  role: 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';

  firstName?: string;
  lastName?: string;

  phone?: string;
  location?: string;

  professionalTitle?: string;
  skills?: string;
  experience?: string;
  education?: string;
  bio?: string;

  profileImageUrl?: string;

  resumeUrl?: string;
  resumeFileName?: string;

  company?: {
    companyName: string;
  };
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  professionalTitle: string;
  skills: string;
  experience: string;
  education: string;
  bio: string;
}

export default function JobSeekerProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    location: '',
    phone:'',
    professionalTitle:'',
    bio:'',
    education:'',
    experience:'',
    skills:'',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --------------------------------------------------
  // Load profile
  // --------------------------------------------------

  useEffect(() => {
  let mounted = true;

  const loadProfile = async () => {
    // ============================================
    // 1. Load cached user immediately
    // ============================================

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (storedUser) {
      try {
        const cachedUser = JSON.parse(
          storedUser,
        ) as UserProfile;

        if (mounted) {
          setUser(cachedUser);

        setForm({
  firstName: cachedUser.firstName ?? '',
  lastName: cachedUser.lastName ?? '',
  location: cachedUser.location ?? '',
  phone: cachedUser.phone ?? '',
  professionalTitle: cachedUser.professionalTitle ?? '',
  skills: cachedUser.skills ?? '',
  experience: cachedUser.experience ?? '',
  education: cachedUser.education ?? '',
  bio: cachedUser.bio ?? '',
});

          // Show page immediately
          setLoading(false);
        }
      } catch (error) {
        console.error(
          'Failed to read cached user:',
          error,
        );
      }
    }

    // ============================================
    // 2. Get latest user from backend
    // ============================================

    try {
      const response = await api.get('/users/profile');

      const profile = response.data as UserProfile;

      if (!mounted) return;

      // Update React state
      setUser(profile);

      setForm({
  firstName: profile.firstName ?? '',
  lastName: profile.lastName ?? '',
  location: profile.location ?? '',
  phone: profile.phone ?? '',
  professionalTitle: profile.professionalTitle ?? '',
  skills: profile.skills ?? '',
  experience: profile.experience ?? '',
  education: profile.education ?? '',
  bio: profile.bio ?? '',
});

      // ============================================
      // 3. Update localStorage
      // ============================================

      const currentStoredUser =
        localStorage.getItem('user');

      let updatedUser = profile;

      if (currentStoredUser) {
        try {
          const currentUser =
            JSON.parse(currentStoredUser);

          updatedUser = {
            ...currentUser,
            ...profile,
          };
        } catch {
          updatedUser = profile;
        }
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser),
      );

      // ============================================
      // 4. Tell Navbar / Toolbar / Sidebar
      // ============================================

      window.dispatchEvent(
        new Event('userUpdated'),
      );
    } catch (err: any) {
      console.error(
        'Failed to load profile:',
        err,
      );

      // Only show error if we don't already have
      // cached user information
      if (!storedUser && mounted) {
        setError(
          err.response?.data?.message ||
            'Failed to load your profile.',
        );
      }

      // Handle expired token
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        router.replace('/login');
        return;
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  loadProfile();

  return () => {
    mounted = false;
  };
}, [router]);

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess('');
    setError('');
  };

  // --------------------------------------------------
  // Save profile
  // --------------------------------------------------

 const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setSaving(true);
  setError('');
  setSuccess('');

  try {
    const response = await api.patch(
      '/users/profile',
      form,
    );

    const updatedUser =
      response.data.user as UserProfile;

    // Update React state
    setUser(updatedUser);

    setForm({
      firstName: updatedUser.firstName ?? '',
      lastName: updatedUser.lastName ?? '',
      location: updatedUser.location ?? '',
      phone: updatedUser.firstName ?? '',
        professionalTitle: updatedUser.lastName ?? '',
        bio: updatedUser.location ?? '',
        education:updatedUser.education ?? '',
        experience:updatedUser.experience ??'',
        skills:updatedUser.skills ??'',

    });

    // ============================================
    // Update localStorage
    // ============================================

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {
      const currentUser =
        JSON.parse(storedUser);

      const newUser = {
        ...currentUser,
        ...updatedUser,
      };

      localStorage.setItem(
        'user',
        JSON.stringify(newUser),
      );
    } else {
      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser),
      );
    }

    // ============================================
    // Notify Navbar / Toolbar / Sidebar
    // ============================================

    window.dispatchEvent(
      new Event('userUpdated'),
    );

    setSuccess(
      'Profile updated successfully.',
    );
  } catch (err: any) {
    console.error(
      'Failed to update profile:',
      err,
    );

    setError(
      err.response?.data?.message ||
        'Failed to update your profile.',
    );
  } finally {
    setSaving(false);
  }
};

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading profile...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No user
  // --------------------------------------------------

  if (!user) {
    return null;
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  const displayName =
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
    'Job Seeker';

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal and professional information.
        </p>
      </div>

      {/* Profile Summary */}

     <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <div className="flex flex-col items-center gap-5 sm:flex-row">
  <ProfileImageUpload
  name={`${user.firstName ?? ''} ${user.lastName ?? ''}`}
  imageUrl={user.profileImageUrl}
  onUploaded={(url) => {
    setUser((previous) =>
      previous
        ? {
            ...previous,
            profileImageUrl: url,
          }
        : previous,
    );

    // Update localStorage
  const storedUser = localStorage.getItem('user');

if (storedUser) {
  try {
    const currentUser = JSON.parse(storedUser);

    const updatedUser = {
      ...currentUser,
      profileImageUrl: url,
    };

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser),
    );

    window.dispatchEvent(new Event('userUpdated'));
  } catch (error) {
    console.error(
      'Failed to update localStorage user:',
      error,
    );
  }
}
  }}
/>

    <div className="text-center sm:text-left">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {user.firstName} {user.lastName}
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {user.email}
      </p>

      <p className="mt-2 text-sm font-medium text-[#1671B9]">
        Job Seeker
      </p>
    </div>
  </div>
</div>
      

      {/* Messages */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {Array.isArray(error) ? error.join(', ') : error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Personal Information */}

      <form onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Section Header */}

          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
                <UserIcon size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Update your basic account information.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {/* First Name */}

            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                First Name
              </label>

              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Last Name */}

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Last Name
              </label>

              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Email */}

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Email cannot be changed here.
              </p>
            </div>

            {/* Location */}

            <div className="sm:col-span-2">
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-5 text-sm font-semibold text-white transition hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>


       {/* Resume */}

<section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

  <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

    <h2 className="font-semibold text-slate-900 dark:text-white">
      Resume
    </h2>

    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
      Upload your latest resume for employers to review.
    </p>

  </div>

  <div className="p-6">

    <ResumeUpload
      resumeUrl={user.resumeUrl}
      resumeFileName={user.resumeFileName}
      onUploaded={(url, fileName) => {
        setUser((previous) =>
          previous
            ? {
                ...previous,
                resumeUrl: url,
                resumeFileName: fileName,
              }
            : previous,
        );

        const storedUser =
          localStorage.getItem('user');

        if (storedUser) {
          try {
            const currentUser =
              JSON.parse(storedUser);

            localStorage.setItem(
              'user',
              JSON.stringify({
                ...currentUser,
                resumeUrl: url,
                resumeFileName: fileName,
              }),
            );

            window.dispatchEvent(
              new Event('userUpdated'),
            );
          } catch (error) {
            console.error(
              'Failed to update stored user:',
              error,
            );
          }
        }
      }}
      onDeleted={() => {
        setUser((previous) =>
          previous
            ? {
                ...previous,
                resumeUrl: undefined,
                resumeFileName: undefined,
              }
            : previous,
        );

        const storedUser =
          localStorage.getItem('user');

        if (storedUser) {
          try {
            const currentUser =
              JSON.parse(storedUser);

            localStorage.setItem(
              'user',
              JSON.stringify({
                ...currentUser,
                resumeUrl: undefined,
                resumeFileName: undefined,
              }),
            );

            window.dispatchEvent(
              new Event('userUpdated'),
            );
          } catch (error) {
            console.error(
              'Failed to update stored user:',
              error,
            );
          }
        }
      }}
    />

  </div>
</section> 
    

      {/* Professional Information */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
              <Briefcase size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Professional Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Add your professional information to improve your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">

  {/* Professional Title */}
  <div>
    <label
      htmlFor="professionalTitle"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Professional Title
    </label>

    <div className="relative">
      <Briefcase
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        id="professionalTitle"
        name="professionalTitle"
        type="text"
        value={form.professionalTitle}
        onChange={handleChange}
        placeholder="e.g. Frontend Developer"
        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  </div>

  {/* Phone */}
  <div>
    <label
      htmlFor="phone"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Phone
    </label>

    <input
      id="phone"
      name="phone"
      type="tel"
      value={form.phone}
      onChange={handleChange}
      placeholder="e.g. +251 912 345 678"
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>

  {/* Skills */}
  <div className="sm:col-span-2">
    <label
      htmlFor="skills"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Skills
    </label>

    <input
      id="skills"
      name="skills"
      type="text"
      value={form.skills}
      onChange={handleChange}
      placeholder="e.g. React, TypeScript, NestJS, PostgreSQL"
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />

    <p className="mt-1.5 text-xs text-slate-400">
      Separate multiple skills with commas.
    </p>
  </div>

  {/* Experience */}
  <div>
    <label
      htmlFor="experience"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Experience
    </label>

    <textarea
      id="experience"
      name="experience"
      value={form.experience}
      onChange={(e) =>
        setForm((previous) => ({
          ...previous,
          experience: e.target.value,
        }))
      }
      rows={5}
      placeholder="Describe your work experience..."
      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>

  {/* Education */}
  <div>
    <label
      htmlFor="education"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      Education
    </label>

    <textarea
      id="education"
      name="education"
      value={form.education}
      onChange={(e) =>
        setForm((previous) => ({
          ...previous,
          education: e.target.value,
        }))
      }
      rows={5}
      placeholder="e.g. BSc Computer Science - Addis Ababa University"
      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>

  {/* Bio */}
  <div className="sm:col-span-2">
    <label
      htmlFor="bio"
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      About Me
    </label>

    <textarea
      id="bio"
      name="bio"
      value={form.bio}
      onChange={(e) =>
        setForm((previous) => ({
          ...previous,
          bio: e.target.value,
        }))
      }
      rows={5}
      placeholder="Write a short professional introduction about yourself..."
      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>

</div>

<div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-800">
  <button
    type="submit"
    disabled={saving}
    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-5 text-sm font-semibold text-white transition hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {saving ? (
      <>
        <Loader2 size={17} className="animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Save size={17} />
        Save Professional Information
      </>
    )}
  </button>
</div>
      </section>
      </form>
    </div>

    
  );
}

function ProfilePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <button
        type="button"
        disabled
        className="mt-4 text-xs font-semibold text-[#1671B9] opacity-60"
      >
        Coming soon
      </button>
    </div>
  );
}