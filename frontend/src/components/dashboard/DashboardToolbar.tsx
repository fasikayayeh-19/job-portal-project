'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  User as UserIcon,
  
} from 'lucide-react';
type UserRole = 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';

interface DashboardUser {
  id: string;
  email: string;
  role: UserRole;

  firstName?: string;
  lastName?: string;

  phone?: string;
  location?: string;
  professionalTitle?: string;
  bio?: string;

  profileImageUrl?: string;

  resumeUrl?: string;
  resumeFileName?: string;

  company?: {
    companyName: string;
  };
}

interface DashboardToolbarProps {
  user: DashboardUser;
}

export default function DashboardToolbar({
  user,
}: DashboardToolbarProps) {
  const router = useRouter();

  const [currentUser, setCurrentUser] =
    useState<DashboardUser>(user);

  const [search, setSearch] = useState('');
    useEffect(() => {
  const updateUser = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(
        storedUser,
      ) as DashboardUser;

      setCurrentUser(parsedUser);
    } catch (error) {
      console.error(
        'Failed to read updated user:',
        error,
      );
    }
  };

  // Initial load
  updateUser();

  // Listen for profile changes
  window.addEventListener(
    'userUpdated',
    updateUser,
  );

  return () => {
    window.removeEventListener(
      'userUpdated',
      updateUser,
    );
  };
}, []);


  /*
  |--------------------------------------------------------------------------
  | Role label
  |--------------------------------------------------------------------------
  */

  const roleLabel =
    currentUser.role === 'JOB_SEEKER'
      ? 'Job Seeker'
      : currentUser.role === 'COMPANY'
        ? 'Company'
        : 'Administrator';

  /*
  |--------------------------------------------------------------------------
  | Search placeholder
  |--------------------------------------------------------------------------
  */

  const searchPlaceholder =
    currentUser.role === 'JOB_SEEKER'
      ? 'Search jobs...'
      : currentUser.role === 'COMPANY'
        ? 'Search applicants...'
        : 'Search users, companies, jobs...';

 

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    if (currentUser.role === 'JOB_SEEKER') {
      router.push(
        `/jobs?search=${encodeURIComponent(value)}`,
      );
      return;
    }

    if (currentUser.role === 'COMPANY') {
      router.push(
        `/dashboard/applicants?search=${encodeURIComponent(value)}`,
      );
      return;
    }

    router.push(
      `/dashboard/users?search=${encodeURIComponent(value)}`,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Profile route
  |--------------------------------------------------------------------------
  */

  return (
    <header
      className="
        sticky
        top-0
        z-30
        mb-6
        rounded-2xl
        border
        border-slate-200
        bg-white/95
        shadow-sm
        backdrop-blur
        dark:border-slate-800
        dark:bg-slate-900/95
      "
    >
      <div
        className="
          flex
          min-h-16
          items-center
          gap-3
          px-4
          py-3
          sm:px-5
        "
      >
        {/* =====================================================
            Search
        ====================================================== */}

        <form
          onSubmit={handleSearch}
          className="min-w-0 flex-1"
        >
          <div className="relative max-w-7xl">
            <Search
              size={20}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
           
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={searchPlaceholder}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#1671B9]
                focus:bg-white
                focus:ring-4
                focus:ring-[#1671B9]/10
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:focus:bg-slate-800
              "
            />
            {search && (
      <button
        type="button"
        onClick={() => setSearch('')}
        className="
          absolute
          right-16
          top-1/2
          -translate-y-1/2
          text-xs
          pr-5
          text-slate-400
          hover:text-slate-600
        "
      >
        Clear
      </button>
    )}

    <button
      type="submit"
      className="
        absolute
        right-1.5
        top-1/2
        -translate-y-1/2
        rounded-lg
        bg-[#1671B9]
        px-3
        py-1.5
        text-xs
        font-semibold
        text-white
        transition
        hover:bg-[#0F5F9E]
      "
    >
      Search
    </button>
          </div>
        </form>

        {/* =====================================================
            Right Actions
        ====================================================== */}

      
      </div>
    </header>
  );
}