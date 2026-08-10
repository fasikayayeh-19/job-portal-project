'use client';

import {
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/40
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-64
          bg-[#1671B9]
          text-white
          transition-transform duration-300
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <h2 className="text-xl font-bold">
            Job Portal
          </h2>
        </div>

        {/* Menu */}
        <nav className="space-y-2 p-4">

          <a
            href="/dashboard"
            className="
              flex items-center gap-3
              rounded-lg
              bg-white/15
              px-4 py-3
              font-medium
              transition
              hover:bg-white/25
            "
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            href="#"
            className="
              flex items-center gap-3
              rounded-lg
              px-4 py-3
              transition
              hover:bg-white/15
            "
          >
            <Bell size={20} />
            Notifications
          </a>

          <a
            href="#"
            className="
              flex items-center gap-3
              rounded-lg
              px-4 py-3
              transition
              hover:bg-white/15
            "
          >
            <Settings size={20} />
            Settings
          </a>

        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4">
          <button
            className="
              flex w-full items-center gap-3
              rounded-lg
              px-4 py-3
              transition
              hover:bg-red-500/20
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}