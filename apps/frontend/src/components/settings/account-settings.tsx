
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DeleteAccountModal from "@/components/profile/delete-account-modal";

/**
 * File: components/settings/account-settings.tsx
 *
 * Description:
 * Provides account management options for Archer's Notes.
 *
 * Features:
 * - Allows users to sign out.
 * - Redirects users after signing out.
 * - Reuses the existing Delete Account modal.
 * - Supports integration with backend authentication.
 */

interface AccountSettingsProps {
  onSignOut?: () => Promise<void> | void;
  onDeleteAccount?: (password: string) => Promise<void> | void;
}

export default function AccountSettings({
  onSignOut,
  onDeleteAccount,
}: AccountSettingsProps) {
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Signs out the current user.
   *
   * The actual session termination is handled
   * by the authentication callback.
   */
  async function handleSignOut() {
    if (!onSignOut || isSigningOut) return;

    setIsSigningOut(true);
    setError(null);

    try {
      await onSignOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
      setError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  /**
   * Handles account deletion after confirmation.
   */
  async function handleDeleteAccount(password: string) {
    if (!onDeleteAccount || isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDeleteAccount(password);
      setIsDeleteModalOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete account:", error);
      setError("Unable to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#343B36]">
                    Account Management
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your account and security preferences.
                </p>
            </div>

            <div className="divide-y divide-gray-200">
                {/* Sign Out */}
                <div className="flex items-center justify-between gap-6 py-5">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#343B36]">
                            Sign Out
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            Sign out of your Archer's Notes account
                            on this device.
                        </p>
                    </div>

                <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={!onSignOut || isSigningOut}
                    className="shrink-0 rounded-md border border-gray-300
                    bg-white px-4 py-2 text-sm font-medium
                    text-[#343B36] transition-colors
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50"
                >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between gap-6 py-5">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-600">
                    Delete Account
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                    Permanently delete your account and
                    associated information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={!onDeleteAccount || isDeleting}
                    className="shrink-0 rounded-md border border-red-500
                    bg-white px-4 py-2 text-sm font-medium
                    text-red-600 transition-colors
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50"
                >
                    Delete Account
                </button>
            </div>
        </div>

        {/* Error Message */}
        {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
            </p>
        )}

        {/* Existing Delete Account Modal */}
        {isDeleteModalOpen && (
            <DeleteAccountModal
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        )}
        </section>
    );
}