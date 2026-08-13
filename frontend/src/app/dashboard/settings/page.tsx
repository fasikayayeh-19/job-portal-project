'use client';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Bell,
  Mail,
  Shield,
  Trash2,
  LogOut,
  Save,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  X,
  Check,
} from 'lucide-react';
import api from '@/lib/axios';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [applicationNotifications, setApplicationNotifications] =
    useState(true);

  const [profileVisibility, setProfileVisibility] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [passwordOpen, setPasswordOpen] =
  useState(false);

const [currentPassword, setCurrentPassword] =
  useState('');

const [newPassword, setNewPassword] =
  useState('');

const [confirmPassword, setConfirmPassword] =
  useState('');

const [passwordError, setPasswordError] =
  useState('');

const [passwordSuccess, setPasswordSuccess] =
  useState('');

const [changingPassword, setChangingPassword] =
  useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);
const [deleting, setDeleting] = useState(false);
const router = useRouter();

const handleDeleteAccount = async () => {
  setDeleting(true);

  try {
    await api.delete('/users/account');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    window.dispatchEvent(new Event('userUpdated'));

    router.replace('/login');
  } catch (error: any) {
    console.error('Failed to delete account:', error);

    setServerError(
      error.response?.data?.message ||
        'Failed to delete your account.',
    );
  } finally {
    setDeleting(false);
    setDeleteOpen(false);
  }
};
  

  useEffect(() => {
    setMounted(true);
  }, []);



  const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  window.location.href = '/login';
};


const handleChangePassword = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setPasswordError('');
  setPasswordSuccess('');

  if (newPassword.length < 6) {
    setPasswordError(
      'New password must be at least 6 characters.',
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError(
      'New passwords do not match.',
    );
    return;
  }

  setChangingPassword(true);

  try {
    await api.patch('/users/change-password', {
      currentPassword,
      newPassword,
    });

    setPasswordSuccess(
      'Password changed successfully.',
    );

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordOpen(false);
      setPasswordSuccess('');
    }, 1500);
  } catch (error: any) {
    console.error(
      'Failed to change password:',
      error,
    );

    setPasswordError(
      error.response?.data?.message ||
        'Failed to change password.',
    );
  } finally {
    setChangingPassword(false);
  }
};

  const handleSaveNotifications = async () => {
    setSaving(true);

    try {
      // We will connect this to the backend later.
      console.log({
        emailNotifications,
        applicationNotifications,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account, security, and notification preferences.
        </p>
      </div>
  {/* Appearance */}
<section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
        <Moon size={19} />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Appearance
        </h2>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Customize how Job Portal looks for you.
        </p>
      </div>
    </div>
  </div>

  <div className="p-6">
    {!mounted ? (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-[74px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-[74px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-[74px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    ) : (
      <div className="grid gap-3 sm:grid-cols-3">

        {/* Light */}
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
            theme === 'light'
              ? 'border-[#1671B9] bg-blue-50 dark:bg-blue-950/30'
              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Sun size={20} />

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Light
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Light appearance
            </p>
          </div>
        </button>

        {/* Dark */}
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
            theme === 'dark'
              ? 'border-[#1671B9] bg-blue-50 dark:bg-blue-950/30'
              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Moon size={20} />

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Dark
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dark appearance
            </p>
          </div>
        </button>

        {/* System */}
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
            theme === 'system'
              ? 'border-[#1671B9] bg-blue-50 dark:bg-blue-950/30'
              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor size={20} />

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              System
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Follow device theme
            </p>
          </div>
        </button>

      </div>
    )}
  </div>
</section>

      {/* Account */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
              <Shield size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Account
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Manage your account settings.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                Email address
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your email address is managed from your account.
              </p>
            </div>

            <Mail
              size={20}
              className="text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
              <Lock size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Security
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Keep your account secure.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
         <button
  type="button"
  onClick={() => {
    setPasswordOpen(true);
    setPasswordError('');
    setPasswordSuccess('');
  }}
  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
>
  <Lock size={17} />
  Change Password
</button>
{passwordOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Change Password
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Update your account password.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPasswordOpen(false)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X size={19} />
        </button>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="space-y-5 p-6"
      >

        {/* Error */}
        {passwordError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {Array.isArray(passwordError)
              ? passwordError.join(', ')
              : passwordError}
          </div>
        )}

        {/* Success */}
        {passwordSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
            <Check size={17} />
            {passwordSuccess}
          </div>
        )}

        {/* Current password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            required
            placeholder="Enter current password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* New password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            required
            minLength={6}
            placeholder="Enter new password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Minimum 8 characters.
          </p>
        </div>

        {/* Confirm password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
            minLength={6}
            placeholder="Confirm new password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

          <button
            type="button"
            onClick={() => setPasswordOpen(false)}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={changingPassword}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-5 text-sm font-semibold text-white hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Changing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Change Password
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  </div>
)}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Email notifications */}
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Email notifications
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Receive important account updates by email.
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(event) =>
                setEmailNotifications(event.target.checked)
              }
              className="h-5 w-5 accent-[#1671B9]"
            />
          </label>

          {/* Application notifications */}
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Application notifications
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Receive updates when your application status changes.
              </p>
            </div>

            <input
              type="checkbox"
              checked={applicationNotifications}
              onChange={(event) =>
                setApplicationNotifications(
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-[#1671B9]"
            />
          </label>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSaveNotifications}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1671B9] px-5 text-sm font-semibold text-white transition hover:bg-[#0F5F9E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </section>
      {/* Privacy */}
<section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
        <Eye size={19} />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Privacy
        </h2>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Control how your profile appears to other users.
        </p>
      </div>
    </div>
  </div>

  <div className="p-6">
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          Profile visibility
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Allow companies to view your profile when searching for candidates.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setProfileVisibility((previous) => !previous)
        }
        className={`relative h-6 w-11 rounded-full transition ${
          profileVisibility
            ? 'bg-[#1671B9]'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            profileVisibility
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    </label>

    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
      {profileVisibility ? (
        <>
          <Eye size={14} />
          Your profile is visible to companies.
        </>
      ) : (
        <>
          <EyeOff size={14} />
          Your profile is hidden from companies.
        </>
      )}
    </div>
  </div>
</section>

      {/* Logout */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <button
  type="button"
  onClick={handleLogout}
  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
>
  <LogOut size={17} />
  Log Out
</button>
        </div>
      </section>

    {/* Danger Zone */}
<section className="rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/50 dark:bg-slate-900">
  {/* Header */}
  <div className="border-b border-red-100 px-6 py-5 dark:border-red-900/40">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
        <Trash2 size={19} />
      </div>

      <div>
        <h2 className="font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h2>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Permanent account actions.
        </p>
      </div>
    </div>
  </div>

  {/* Danger Zone Content */}
  <div className="p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Delete Account
        </h3>

        <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Permanently delete your account and all associated data.
          This action cannot be undone.
        </p>
      </div>

      {/* Open Modal Button */}
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        disabled={deleting}
        className="
          inline-flex
          h-10
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-red-200
          px-4
          text-sm
          font-semibold
          text-red-600
          transition
          hover:bg-red-50
          disabled:cursor-not-allowed
          disabled:opacity-60
          dark:border-red-900/50
          dark:text-red-400
          dark:hover:bg-red-950/30
        "
      >
        <Trash2 size={17} />
        Delete Account
      </button>
    </div>
  </div>
</section>
{/* ============================================================
    DELETE ACCOUNT MODAL
============================================================ */}

{deleteOpen && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/50
      px-4
      backdrop-blur-sm
    "
  >
    <div
      className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
        dark:bg-slate-900
      "
    >
      {/* Modal Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <Trash2 size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete your account?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This action is permanent. Your account and associated
            data will be deleted and cannot be recovered.
          </p>
        </div>
      </div>

      {/* Error */}
      {serverError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {Array.isArray(serverError)
            ? serverError.join(', ')
            : serverError}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setDeleteOpen(false);
            setServerError('');
          }}
          disabled={deleting}
          className="
            rounded-lg
            border
            border-slate-200
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-slate-700
            dark:text-slate-200
            dark:hover:bg-slate-800
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Trash2 size={16} />

          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}