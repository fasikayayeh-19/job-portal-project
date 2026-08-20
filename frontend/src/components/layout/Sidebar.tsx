'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getCurrentUser } from '@/lib/auth';

import {
  LayoutDashboard,
  Search,
  BriefcaseBusiness,
  Bookmark,
  FileText,
  Building2,
  Users,
  ClipboardList,
  Settings,
  Settings2,
  LogOut,
  X,
  Plus,
  ShieldCheck,
  BarChart3,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type UserRole = 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';

interface SidebarUser {
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
    logoUrl?: string;
    profileImageUrl?: string;
  };
}

interface SidebarProps {
  user: SidebarUser;
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}


/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar({
  user,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] =
    useState<SidebarUser>(user);

  useEffect(() => {
    // Get latest user from localStorage
    const updateUser = () => {
      const storedUser = getCurrentUser();

      if (storedUser) {
        setCurrentUser(storedUser);
      }
    };

    // Initial load
    updateUser();

    // Listen for profile updates
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

  // Your other Sidebar code starts here...

  /* ==========================================================
     COMMON
     Profile + Notifications are intentionally NOT here.
     They will be in the dashboard header.
  ========================================================== */

  const commonItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={19} />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings size={19} />,
    },
  ];

  /* ==========================================================
     JOB SEEKER
  ========================================================== */

const jobSeekerItems: MenuItem[] = [
  {
    label: 'Find Jobs',
    href: '/jobs',
    icon: <Search size={19} />,
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
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: <UserCircle size={19} />,
  },
];

  /* ==========================================================
     COMPANY
  ========================================================== */

  const companyItems: MenuItem[] = [
    {
      label: 'Company Profile',
      href: '/dashboard/profile',
      icon: <Building2 size={19} />,
    },
    {
      label: 'My Jobs',
      href: '/dashboard/jobs',
      icon: <BriefcaseBusiness size={19} />,
    },
    {
      label: 'Post a Job',
      href: '/dashboard/jobs/create',
      icon: <Plus size={19} />,
    },
    {
      label: 'Applicants',
      href: '/dashboard/applicants',
      icon: <Users size={19} />,
    },
    {
      label: 'Applications',
      href: '/dashboard/company-applications',
      icon: <ClipboardList size={19} />,
    },
  
  ];

  /* ==========================================================
     ADMIN
  ========================================================== */

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
      href: '/dashboard/jobs-admin',
      icon: <BriefcaseBusiness size={19} />,
    },
    {
      label: 'Applications',
      href: '/dashboard/applications',
      icon: <ClipboardList size={19} />,
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 size={19} />,
    },
    {
    label: 'Management',
    href: '/dashboard/management',
    icon: <Settings2 size={19} />,
  },
  ];

  /* ==========================================================
     SELECT ROLE MENU
  ========================================================== */

  let roleItems: MenuItem[] = [];

  if (currentUser.role === 'JOB_SEEKER') {
    roleItems = jobSeekerItems;
  } else if (currentUser.role === 'COMPANY') {
    roleItems = companyItems;
  } else if (currentUser.role === 'ADMIN') {
    roleItems = adminItems;
  }

  /* ==========================================================
     ROLE TITLE
  ========================================================== */

  const roleTitle =
    currentUser.role === 'JOB_SEEKER'
      ? 'Job Seeker'
      : currentUser.role === 'COMPANY'
        ? 'Company'
        : 'Administration';

  /* ==========================================================
     DISPLAY NAME
  ========================================================== */

  const displayName =
    currentUser.role === 'COMPANY'
      ? currentUser.company?.companyName || 'Company'
      : currentUser.role === 'ADMIN'
        ? 'Administrator'
        : `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() ||
          'Job Seeker';

  /* ==========================================================
     ROLE LABEL
  ========================================================== */

  const roleLabel =
    currentUser.role === 'JOB_SEEKER'
      ? 'Job Seeker'
      : currentUser.role === 'COMPANY'
        ? 'Company'
        : 'Administrator';

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    onClose();

    router.push('/login');
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* ======================================================
          MOBILE OVERLAY
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

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 z-50 flex flex-col
          bg-[#1671B9] text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          top-0 h-screen
        `}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className={`flex h-16 shrink-0 items-center border-b border-white/15 ${collapsed ? 'justify-center px-1' : 'px-3'}`}>
          {!collapsed && (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex min-w-0 items-center gap-2 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">
                JP
              </div>
              <span className="truncate">Job Portal</span>
            </Link>
          )}

          <div className={`${collapsed ? '' : 'ml-auto'} flex items-center gap-1`}>
            {/* Collapse toggle — desktop only */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dashboard menu"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ====================================================
            USER INFORMATION
        ==================================================== */}

        <div className="shrink-0 border-b border-white/15 px-3 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-white ring-2 ring-white/20">
              {(() => {
                const avatarUrl = currentUser.role === 'COMPANY'
                  ? (currentUser.company?.logoUrl || currentUser.company?.profileImageUrl || currentUser.profileImageUrl)
                  : currentUser.profileImageUrl;

                return avatarUrl ? (
                  <img
                    src={avatarUrl.startsWith('http') ? avatarUrl : `http://localhost:3000${avatarUrl}`}
                    alt={`${displayName} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                );
              })()}
            </div>

            {/* Name + role */}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-white/70">
                  {roleLabel}
                </p>
              </div>
            )}
          </div>

          {/* Role badge */}
          {!collapsed && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
                <ShieldCheck size={12} />
                {roleTitle}
              </span>
            </div>
          )}
        </div>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {/* Common items */}
          <div className="space-y-1">
            {commonItems.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClose={onClose}
                collapsed={collapsed}
              />
            ))}
          </div>

          {/* Role-specific */}
          <div className="mt-5">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                {roleTitle}
              </p>
            )}
            {collapsed && <div className="mb-2 h-px bg-white/15 mx-2" />}

            <div className="space-y-1">
              {roleItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* ====================================================
            LOGOUT
        ==================================================== */}

        <div className="shrink-0 border-t border-white/15 p-2">
          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-red-500/20 hover:text-white"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={19} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}


/* ============================================================
   SIDEBAR LINK
============================================================ */

function SidebarLink({
  item,
  pathname,
  onClose,
  collapsed,
}: {
  item: MenuItem;
  pathname: string;
  onClose: () => void;
  collapsed: boolean;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={onClose}
        className={`
          flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
          ${collapsed ? 'justify-center' : ''}
          ${
            isActive
              ? 'bg-white text-[#1671B9] shadow-sm'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }
        `}
        title={collapsed ? item.label : undefined}
      >
        <span className="flex shrink-0 items-center justify-center">
          {item.icon}
        </span>
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-slate-700">
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
        </div>
      )}
    </div>
  );
}