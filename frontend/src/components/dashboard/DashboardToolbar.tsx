'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Check,
} from 'lucide-react';

import  api from '@/lib/axios';
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
interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function DashboardToolbar({
  user,
}: DashboardToolbarProps) {
  const router = useRouter();

  const [currentUser, setCurrentUser] =
    useState<DashboardUser>(user);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [search, setSearch] = useState('');

  const [notifications, setNotifications] =
    useState<Notification[]>([]);
const unreadCount = notifications.filter((n) => !n.isRead).length;
 
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);
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

useEffect(() => {
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const response = await api.get('/notifications');

      setNotifications(response.data);
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error,
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  loadNotifications();
}, []);




const handleNotificationClick = async (
  notification: Notification,
) => {
  try {
    if (!notification.isRead) {
      await api.patch(
        `/notifications/${notification.id}/read`,
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: true,
              }
            : item,
        ),
      );
    }

    setNotificationsOpen(false);

    if (notification.link) {
      router.push(notification.link);
    }
  } catch (error) {
    console.error(
      'Failed to mark notification as read:',
      error,
    );
  }
};
/*
  |--------------------------------------------------------------------------
  | Display name
  |--------------------------------------------------------------------------
  */

  const displayName =
    currentUser.role === 'COMPANY'
      ? currentUser.company?.companyName || 'Company'
      : currentUser.role === 'ADMIN'
        ? 'Administrator'
        : `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() ||
          'Job Seeker';

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
  | Avatar initial
  |--------------------------------------------------------------------------
  */

  const initial = displayName.charAt(0).toUpperCase();

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

  const handleProfile = () => {
    setProfileOpen(false);

    if (currentUser.role === 'COMPANY') {
      router.push('/dashboard/company-profile');
      return;
    }

    router.push('/dashboard/profile');
  };

  /*
  |--------------------------------------------------------------------------
  | Settings
  |--------------------------------------------------------------------------
  */

  const handleSettings = () => {
    setProfileOpen(false);
    router.push('/dashboard/settings');
  };

  /*
  |--------------------------------------------------------------------------
  | Notifications
  |--------------------------------------------------------------------------
  */

  const handleNotifications = () => {
    router.push('/dashboard/notifications');
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setProfileOpen(false);

    router.replace('/login');
  };

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
          <div className="relative max-w-5xl">
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

        <div className="flex shrink-0 items-center gap-1.5">

          {/* Notifications */}

          <div className="relative">
  <button
    type="button"
    onClick={() =>
      setNotificationsOpen(
        (previous) => !previous,
      )
    }
    aria-label="Notifications"
    aria-expanded={notificationsOpen}
    className="
      relative
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-slate-200
      bg-white
      text-slate-500
      transition
      hover:border-[#1671B9]/30
      hover:bg-blue-50
      hover:text-[#1671B9]
      dark:border-slate-700
      dark:bg-slate-900
      dark:text-slate-300
      dark:hover:bg-slate-800
    "
  >
    <Bell size={19} />

    {unreadCount > 0 && (
      <span
        className="
          absolute
          -right-1
          -top-1
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          bg-red-500
          px-1
          text-[10px]
          font-bold
          text-white
          ring-2
          ring-white
          dark:ring-slate-900
        "
      >
        {unreadCount > 99
          ? '99+'
          : unreadCount}
      </span>
    )}
  </button>

  {/* Notification Dropdown */}
  {notificationsOpen && (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={() =>
          setNotificationsOpen(false)
        }
        className="
          fixed
          inset-0
          z-40
          cursor-default
        "
      />

      <div
        className="
          absolute
          right-0
          top-12
          z-50
          w-[340px]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-xl
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-4
            py-3
            dark:border-slate-800
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : 'All caught up'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(false);
              router.push(
                '/dashboard/notifications',
              );
            }}
            className="
              text-xs
              font-semibold
              text-[#1671B9]
              hover:underline
            "
          >
            View all
          </button>
        </div>

        {/* Body */}

        <div className="max-h-[360px] overflow-y-auto">
          {notificationsLoading ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-slate-400">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                No notifications
              </p>

              <p className="mt-1 text-xs text-slate-400">
                You're all caught up.
              </p>
            </div>
          ) : (
            notifications
              .slice(0, 5)
              .map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification,
                    )
                  }
                  className={`
                    flex
                    w-full
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-slate-50
                    dark:border-slate-800
                    dark:hover:bg-slate-800

                    ${
                      !notification.isRead
                        ? 'bg-blue-50/50 dark:bg-blue-950/20'
                        : ''
                    }
                  `}
                >
                  {/* Status */}

                  <div className="mt-1.5 shrink-0">
                    {notification.isRead ? (
                      <Check
                        size={15}
                        className="text-slate-300"
                      />
                    ) : (
                      <span
                        className="
                          block
                          h-2.5
                          w-2.5
                          rounded-full
                          bg-[#1671B9]
                        "
                      />
                    )}
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        truncate
                        text-sm
                        ${
                          notification.isRead
                            ? 'font-medium text-slate-600 dark:text-slate-300'
                            : 'font-semibold text-slate-900 dark:text-white'
                        }
                      `}
                    >
                      {notification.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))
          )}
        </div>
      </div>
    </>
  )}
</div>

          {/* Divider */}

          <div
            className="
              mx-1
              hidden
              h-7
              w-px
              bg-slate-200
              sm:block
              dark:bg-slate-700
            "
          />

          {/* Profile */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (previous) => !previous,
                )
              }
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                p-1.5
                transition
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              {/* Avatar */}

 <div
  className="
    flex
    h-9
    w-9
    shrink-0
    items-center
    justify-center
    overflow-hidden
    rounded-full
    bg-[#1671B9]
    text-sm
    font-bold
    text-white
    ring-2
    ring-[#1671B9]/10
  "
>
  {currentUser.profileImageUrl ? (
    <img
      src={`http://localhost:3000${currentUser.profileImageUrl}`}
      alt={`${displayName} profile`}
      className="h-full w-full object-cover"
    />
  ) : (
    initial
  )}
</div>
              {/* User information */}

              <div className="hidden max-w-36 text-left lg:block">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                    dark:text-white
                  "
                >
                  {displayName}
                </p>

                <p
                  className="
                    truncate
                    text-[11px]
                    text-slate-400
                  "
                >
                  {roleLabel}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="
                  hidden
                  text-slate-400
                  lg:block
                "
              />
            </button>

            {/* =================================================
                Dropdown
            ================================================== */}

            {profileOpen && (
              <>
                {/* Click outside */}

                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="
                    fixed
                    inset-0
                    z-40
                    cursor-default
                  "
                />

                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-60
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    py-2
                    shadow-xl
                    dark:border-slate-700
                    dark:bg-slate-900
                  "
                  role="menu"
                >
                  {/* Account information */}

                  <div
                    className="
                      border-b
                      border-slate-100
                      px-4
                      py-3
                      dark:border-slate-800
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-white
                      "
                    >
                      {displayName}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-slate-400
                      "
                    >
                      {user.email}
                    </p>
                  </div>

                  {/* Profile */}

                  <button
                    type="button"
                    onClick={handleProfile}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-2.5
                      text-sm
                      text-slate-600
                      transition
                      hover:bg-slate-50
                      hover:text-[#1671B9]
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                    role="menuitem"
                  >
                    <UserIcon size={17} />
                    <span>Profile</span>
                  </button>

                  {/* Settings */}

                  <button
                    type="button"
                    onClick={handleSettings}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-2.5
                      text-sm
                      text-slate-600
                      transition
                      hover:bg-slate-50
                      hover:text-[#1671B9]
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                    role="menuitem"
                  >
                    <Settings size={17} />
                    <span>Settings</span>
                  </button>

                  {/* Logout divider */}

                  <div
                    className="
                      my-1
                      border-t
                      border-slate-100
                      dark:border-slate-800
                    "
                  />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-2.5
                      text-sm
                      text-red-500
                      transition
                      hover:bg-red-50
                      dark:hover:bg-red-950/20
                    "
                    role="menuitem"
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}