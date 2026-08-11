'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  FileText,
  Building2,
  Users,
  Bell,
  Settings,
  LogOut,
  X,
  ClipboardList,
} from 'lucide-react';

type UserRole = 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';

interface SidebarUser {
  id: string;
  email: string;
  role: UserRole;

  firstName?: string;
  lastName?: string;

  company?: {
    companyName: string;
  };
}

interface SidebarProps {
  user: SidebarUser;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar({
  user,
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  /*
   * -------------------------------------------------------
   * Common menu items
   * -------------------------------------------------------
   */

  const commonItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: 'Notifications',
      href: '/dashboard/notifications',
      icon: <Bell size={19} />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings size={19} />,
    },
  ];

  /*
   * -------------------------------------------------------
   * Job Seeker menu
   * -------------------------------------------------------
   */

  const jobSeekerItems: MenuItem[] = [
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <User size={19} />,
    },
    {
      label: 'Find Jobs',
      href: '/jobs',
      icon: <Briefcase size={19} />,
    },
    {
      label: 'My Applications',
      href: '/dashboard/applications',
      icon: <FileText size={19} />,
    },
    {
      label: 'Saved Jobs',
      href: '/dashboard/saved-jobs',
      icon: <Bookmark size={19} />,
    },
  ];

  /*
   * -------------------------------------------------------
   * Company menu
   * -------------------------------------------------------
   */

  const companyItems: MenuItem[] = [
    {
      label: 'Company Profile',
      href: '/dashboard/company-profile',
      icon: <Building2 size={19} />,
    },
    {
      label: 'My Jobs',
      href: '/dashboard/jobs',
      icon: <Briefcase size={19} />,
    },
    {
      label: 'Applicants',
      href: '/dashboard/applicants',
      icon: <Users size={19} />,
    },
  ];

  /*
   * -------------------------------------------------------
   * Admin menu
   * -------------------------------------------------------
   */

  const adminItems: MenuItem[] = [
    {
      label: 'Users',
      href: '/dashboard/users',
      icon: <Users size={19} />,
    },
    {
      label: 'Companies',
      href: '/dashboard/companies',
      icon: <Building2 size={19} />,
    },
    {
      label: 'Jobs',
      href: '/dashboard/jobs',
      icon: <Briefcase size={19} />,
    },
    {
      label: 'Applications',
      href: '/dashboard/applications',
      icon: <ClipboardList size={19} />,
    },
  ];

  /*
   * -------------------------------------------------------
   * Select menu based on role
   * -------------------------------------------------------
   */

  let roleItems: MenuItem[] = [];

  if (user.role === 'JOB_SEEKER') {
    roleItems = jobSeekerItems;
  }

  if (user.role === 'COMPANY') {
    roleItems = companyItems;
  }

  if (user.role === 'ADMIN') {
    roleItems = adminItems;
  }

  /*
   * -------------------------------------------------------
   * Logout
   * -------------------------------------------------------
   */

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    onClose();

    router.push('/login');
  };

  /*
   * -------------------------------------------------------
   * Display name
   * -------------------------------------------------------
   */

  const displayName =
    user.role === 'COMPANY'
      ? user.company?.companyName || 'Company'
      : user.role === 'ADMIN'
        ? 'Administrator'
        : `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
          'Job Seeker';

  /*
   * -------------------------------------------------------
   * Role label
   * -------------------------------------------------------
   */

  const roleLabel =
    user.role === 'JOB_SEEKER'
      ? 'Job Seeker'
      : user.role === 'COMPANY'
        ? 'Company'
        : 'Administrator';

  /*
   * -------------------------------------------------------
   * Render
   * -------------------------------------------------------
   */

  return (
    <>
      {/* =====================================================
          Mobile Overlay
      ====================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-[1px]
            md:hidden
          "
        />
      )}

      {/* =====================================================
          Sidebar
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          bg-[#1671B9]
          text-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          md:translate-x-0

          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* ===================================================
            Sidebar Header
        ==================================================== */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-white/15
            px-5
          "
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
              transition-opacity
              hover:opacity-90
            "
          >
            Job Portal
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-white/80
              transition
              hover:bg-white/10
              hover:text-white
              md:hidden
            "
            aria-label="Close dashboard menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            User Information
        ==================================================== */}

        <div
          className="
            shrink-0
            border-b
            border-white/15
            px-5
            py-5
          "
        >
          {/* Avatar */}
          <div className="mb-3 flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-sm
                font-bold
                text-[#1671B9]
              "
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {displayName}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-blue-100
                "
              >
                {user.email}
              </p>
            </div>

          </div>

          {/* Role */}
          <div
            className="
              inline-flex
              rounded-full
              bg-white/15
              px-2.5
              py-1
              text-[11px]
              font-semibold
              text-white
            "
          >
            {roleLabel}
          </div>
        </div>

        {/* ===================================================
            Navigation
        ==================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5

            scrollbar-thin
          "
        >

          {/* =================================================
              Overview
          ================================================== */}

          <div className="mb-6">

            <p
              className="
                mb-2
                px-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-blue-100/70
              "
            >
              Overview
            </p>

            <div className="space-y-1">

              {commonItems
                .slice(0, 1)
                .map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}

            </div>

          </div>

          {/* =================================================
              Role Menu
          ================================================== */}

          {roleItems.length > 0 && (
            <div className="mb-6">

              <p
                className="
                  mb-2
                  px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-100/70
                "
              >
                {user.role === 'JOB_SEEKER'
                  ? 'Job Seeker'
                  : user.role === 'COMPANY'
                    ? 'Company'
                    : 'Administration'}
              </p>

              <div className="space-y-1">

                {roleItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}

              </div>

            </div>
          )}

          {/* =================================================
              General
          ================================================== */}

          <div>

            <p
              className="
                mb-2
                px-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-blue-100/70
              "
            >
              General
            </p>

            <div className="space-y-1">

              {commonItems
                .slice(1)
                .map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}

            </div>

          </div>

        </nav>

        {/* ===================================================
            Logout
        ==================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-white/15
            p-3
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-sm
              font-medium
              text-white/85
              transition-colors
              hover:bg-red-500/20
              hover:text-white
            "
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Sidebar Link
|--------------------------------------------------------------------------
*/

function SidebarLink({
  item,
  pathname,
  onClose,
}: {
  item: MenuItem;
  pathname: string;
  onClose: () => void;
}) {
  const isActive =
    pathname === item.href ||
    (
      item.href !== '/dashboard' &&
      pathname.startsWith(`${item.href}/`)
    );

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={`
        group
        flex
        items-center
        gap-3
        rounded-lg
        px-3
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200

        ${
          isActive
            ? `
              bg-white
              text-[#1671B9]
              shadow-sm
            `
            : `
              text-white/85
              hover:bg-white/10
              hover:text-white
            `
        }
      `}
    >
      {/* Icon */}
      <span
        className={`
          flex
          shrink-0
          items-center
          justify-center
          transition-transform
          duration-200
          group-hover:scale-105

          ${
            isActive
              ? 'text-[#1671B9]'
              : 'text-white/80'
          }
        `}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span>
        {item.label}
      </span>
    </Link>
  );
}