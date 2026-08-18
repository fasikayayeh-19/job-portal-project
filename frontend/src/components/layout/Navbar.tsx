"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Bell,
  Check,
} from "lucide-react";
import {
  getMyNotifications,
  markNotificationAsRead,
  type Notification,
} from "@/services/notifications.service";
import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios";

import { type AuthUser, getCurrentUser } from "@/lib/auth";

interface DashboardUser {
  id: string;
  email: string;
  role: "JOB_SEEKER" | "COMPANY" | "ADMIN";

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

interface ProfileAvatarProps {
  user: DashboardUser;
  displayName: string;
  size?: "small" | "normal";
}

function ProfileAvatar({
  user,
  displayName,
  size = "normal",
}: ProfileAvatarProps) {
  const initial = displayName.charAt(0).toUpperCase();

  const imageUrl = user.profileImageUrl
    ? user.profileImageUrl.startsWith("http")
      ? user.profileImageUrl
      : `http://localhost:3000${
          user.profileImageUrl.startsWith("/") ? "" : "/"
        }${user.profileImageUrl}`
    : null;

  return (
    <div
      className={`
        flex shrink-0 items-center justify-center
        overflow-hidden rounded-full
        bg-[#1671B9]
        font-bold text-white
        ring-2 ring-[#1671B9]/10
        ${size === "normal" ? "h-10 w-10 text-sm" : "h-9 w-9 text-xs"}
      `}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${displayName} profile`}
          className="h-full w-full object-cover"
          onError={(event) => {
            console.error("Profile image failed:", imageUrl);

            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [user, setUser] = useState<DashboardUser | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const data = await getMyNotifications();

      setNotifications(data);

      const unread = data.filter((notification) => !notification.isRead).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };
  // ============================================
  // Load current user
  // ============================================
useEffect(() => {
  let mounted = true;

  const loadUser = async () => {
    // ============================================
    // 1. Load cached user immediately
    // ============================================

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const cachedUser =
          JSON.parse(storedUser) as DashboardUser;

        if (mounted) {
          setUser(cachedUser);
        }
      } catch (error) {
        console.error(
          "Failed to parse stored user:",
          error,
        );
      }
    }

    // ============================================
    // 2. Check token
    // ============================================

    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      if (mounted) {
        setUser(null);
        setNotifications([]);
        setUnreadCount(0);
      }

      return;
    }

    // ============================================
    // 3. Load latest user
    // ============================================

    try {
      const response =
        await api.get("/users/profile");

      if (!mounted) return;

      const latestUser =
        response.data as DashboardUser;

      setUser(latestUser);

      localStorage.setItem(
        "user",
        JSON.stringify(latestUser),
      );
    } catch (error: any) {
      console.error(
        "Failed to load navbar user:",
        error,
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        if (mounted) {
          setUser(null);
          setNotifications([]);
          setUnreadCount(0);
        }

        return;
      }
    }

    // ============================================
    // 4. Load notifications
    // ============================================

    try {
      if (mounted) {
        setNotificationsLoading(true);
      }

      const data =
        await getMyNotifications();

      if (!mounted) return;

      setNotifications(data);

      setUnreadCount(
        data.filter(
          (notification) =>
            !notification.isRead,
        ).length,
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error,
      );

      if (mounted) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (mounted) {
        setNotificationsLoading(false);
      }
    }
  };

  // ============================================
  // Run
  // ============================================

  loadUser();

  // ============================================
  // Profile upload/update event
  // ============================================

  const handleUserUpdated = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) return;

    try {
      const updatedUser =
        JSON.parse(storedUser) as DashboardUser;

      if (mounted) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error(
        "Failed to update navbar user:",
        error,
      );
    }
  };

  window.addEventListener(
    "userUpdated",
    handleUserUpdated,
  );

  return () => {
    mounted = false;

    window.removeEventListener(
      "userUpdated",
      handleUserUpdated,
    );
  };
}, []);

  // ============================================
  // Navigation
  // ============================================

  const handleNavigation = () => {
    setIsNavigating(true);
  };

  // ============================================
  // User display
  // ============================================

  const displayName =
    user?.role === "COMPANY"
      ? user.company?.companyName || "Company"
      : user?.role === "ADMIN"
      ? "Administrator"
      : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        "Job Seeker";

  const initial = displayName.charAt(0).toUpperCase();

  const roleLabel =
    user?.role === "JOB_SEEKER"
      ? "Job Seeker"
      : user?.role === "COMPANY"
      ? "Company"
      : "Administrator";

  // ============================================
  // Profile
  // ============================================

  const handleProfile = () => {
    setProfileOpen(false);

    if (user?.role === "COMPANY") {
      router.push("/dashboard/profile");
      return;
    }

    router.push("/dashboard/profile");
  };

  // ============================================
  // Settings
  // ============================================

  const handleSettings = () => {
    setProfileOpen(false);
    router.push("/dashboard/settings");
  };

  // ============================================
  // Logout
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);

    router.replace("/login");
  };

  // ============================================
  // Notification click
  // ============================================
  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((previous) => Math.max(previous - 1, 0));
      }

      setNotificationsOpen(false);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#020817]">
      <nav className="mx-auto flex h-30 items-center justify-between px-5 sm:px-6 lg:px-10">
        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={process.env.NEXT_PUBLIC_LOGO_URL!}
            alt="Job Portal"
            width={90}
            height={25}
            priority
            className="h-auto w-auto object-contain"
          />
        </Link>

        {/* ================================================= */}
        {/* NAVIGATION */}
        {/* ================================================= */}

        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/jobs"
            onClick={handleNavigation}
            className={`group relative text-lg font-medium transition-colors ${
              pathname === "/jobs"
                ? "text-[#1671B9]"
                : "text-slate-800 hover:text-[#1671B9] dark:text-slate-200"
            }`}
          >
            Find Jobs
            <span
              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#1671B9] transition-all ${
                pathname === "/jobs" && !isNavigating ? "w-full" : "w-0"
              }`}
            />
          </Link>

          <Link
            href="/companies"
            onClick={handleNavigation}
            className={`group relative text-lg font-medium transition-colors ${
              pathname === "/companies"
                ? "text-[#1671B9]"
                : "text-slate-800 hover:text-[#1671B9] dark:text-slate-200"
            }`}
          >
            Find Companies
            <span
              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#1671B9] transition-all ${
                pathname === "/companies" && !isNavigating ? "w-full" : "w-0"
              }`}
            />
          </Link>

          <Link
            href="/about"
            onClick={handleNavigation}
            className={`group relative text-lg font-medium transition-colors ${
              pathname === "/about"
                ? "text-[#1671B9]"
                : "text-slate-800 hover:text-[#1671B9] dark:text-slate-200"
            }`}
          >
            About Us
            <span
              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#1671B9] transition-all ${
                pathname === "/about" && !isNavigating ? "w-full" : "w-0"
              }`}
            />
          </Link>

          <Link
            href="/contact"
            onClick={handleNavigation}
            className={`group relative text-lg font-medium transition-colors ${
              pathname === "/contact"
                ? "text-[#1671B9]"
                : "text-slate-800 hover:text-[#1671B9] dark:text-slate-200"
            }`}
          >
            Contact
            <span
              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#1671B9] transition-all ${
                pathname === "/contact" && !isNavigating ? "w-full" : "w-0"
              }`}
            />
          </Link>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* Dashboard */}

              <Link
                href="/dashboard"
                onClick={handleNavigation}
                className="rounded-lg bg-[#1671B9] px-5 py-2.5 text-lg font-medium text-white transition hover:bg-[#0F5F9E]"
              >
                Dashboard
              </Link>

              {/* ================================================= */}
              {/* NOTIFICATIONS */}
              {/* ================================================= */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !notificationsOpen;

                    setNotificationsOpen(nextState);

                    if (nextState) {
                      loadNotifications();
                    }
                  }}
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#1671B9]/30 hover:bg-blue-50 hover:text-[#1671B9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Bell size={19} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      {/* Header */}

                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Notifications
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {unreadCount > 0
                              ? `${unreadCount} unread`
                              : "All caught up"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setNotificationsOpen(false);

                            router.push("/dashboard/notifications");
                          }}
                          className="text-xs font-semibold text-[#1671B9] hover:underline"
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
                          notifications.slice(0, 5).map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                                !notification.isRead
                                  ? "bg-blue-50/50 dark:bg-blue-950/20"
                                  : ""
                              }`}
                            >
                              <div className="mt-1.5 shrink-0">
                                {notification.isRead ? (
                                  <Check size={15} className="text-slate-300" />
                                ) : (
                                  <span className="block h-2.5 w-2.5 rounded-full bg-[#1671B9]" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-sm ${
                                    notification.isRead
                                      ? "font-medium text-slate-600 dark:text-slate-300"
                                      : "font-semibold text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {notification.title}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                  {notification.message}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">
                                  {new Date(
                                    notification.createdAt
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

              <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-700" />

              {/* ================================================= */}
              {/* PROFILE */}
              {/* ================================================= */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((previous) => !previous)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ProfileAvatar
                    user={user}
                    displayName={displayName}
                    size="small"
                  />

                  <ChevronDown
                    size={16}
                    className="hidden text-slate-400 lg:block"
                  />
                </button>

                {/* ================================================= */}
                {/* PROFILE DROPDOWN */}
                {/* ================================================= */}

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      onClick={() => setProfileOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    <div
                      className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                      role="menu"
                    >
                      {/* Account */}

                      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                            {displayName}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Profile */}

                      <button
                        type="button"
                        onClick={handleProfile}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#1671B9] dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <UserIcon size={17} />
                        <span>Profile</span>
                      </button>

                      {/* Settings */}

                      <button
                        type="button"
                        onClick={handleSettings}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#1671B9] dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Settings size={17} />
                        <span>Settings</span>
                      </button>

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut size={17} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}

              <Link
                href="/login"
                onClick={handleNavigation}
                className="rounded-lg px-4 py-2 text-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
              >
                Login
              </Link>

              {/* Sign Up */}

              <Link
                href="/register"
                onClick={handleNavigation}
                className="rounded-lg bg-[#1671B9] px-5 py-2.5 text-lg font-medium text-white hover:bg-[#0F5F9E]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ================================================= */}
        {/* MOBILE */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] md:hidden dark:text-slate-200"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}

      {/* ================================================= */}
      {/* MOBILE NAVIGATION */}
      {/* ================================================= */}

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#020817] md:hidden">
          <div className="flex flex-col gap-2">
            {/* Public Navigation */}

            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
            >
              Find Jobs
            </Link>

            <Link
              href="/companies"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
            >
              Find Companies
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
            >
              Contact
            </Link>

            {/* Logged-in User */}

            {user ? (
              <>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                {/* Dashboard */}

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-[#1671B9] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0F5F9E]"
                >
                  Dashboard
                </Link>

                {/* Notifications */}

                <Link
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
                >
                  <span className="flex items-center gap-3">
                    <Bell size={18} />
                    Notifications
                  </span>

                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
                >
                  <UserIcon size={18} />
                  Profile
                </button>

                {/* Settings */}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
                >
                  <Settings size={18} />
                  Settings
                </button>

                {/* Logout */}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                {/* Login */}

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200"
                >
                  Login
                </Link>

                {/* Sign Up */}

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-[#1671B9] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#0F5F9E]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
