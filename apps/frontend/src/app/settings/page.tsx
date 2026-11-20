"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/main-layout";

import AcademicSettings, {
    type AcademicSettingsData,
} from "@/components/settings/academic-settings";

import NotificationSettings, {
    type NotificationSettingsData,
} from "@/components/settings/notification-settings";

import AccountSettings from "@/components/settings/account-settings";

/**
 * File: app/settings/page.tsx
 *
 * Description:
 * Displays the user settings page for Archer's Notes.
 *
 * Features:
 * - Allows users to edit their academic information.
 * - Allows users to manage notification preferences.
 * - Provides account management options.
 * - Saves user settings to localStorage temporarily.
 * - Loads saved settings when the page opens.
 * - Aligns the settings content with the navbar search bar.
 */

interface UserSettings {
    academic: AcademicSettingsData;
    notifications: NotificationSettingsData;
}

interface UserProfileResponse {
    college_id: number | null;
    college: {
        college_id: number;
        name: string;
    } | null;
    program: string | null;
    batch_id: number | null;
    in_app_notifications: boolean;
    email_notifications: boolean;
    comment_notifications: boolean;
}

const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const collegeIds: Record<string, number> = {
    BAGCED: 1,
    CCS: 2,
    CLA: 3,
    COB: 4,
    COS: 5,
    GCOE: 6,
    SOE: 7,
};

const collegeCodes: Record<number, string> = {
    1: "BAGCED",
    2: "CCS",
    3: "CLA",
    4: "COB",
    5: "COS",
    6: "GCOE",
    7: "SOE",
};

const defaultSettings: UserSettings = {
    academic: {
        college: "CCS",
        course: "Computer Science Major in Software Technology",
        batchId: "128",
    },
    notifications: {
        inAppNotifications: true,
        emailNotifications: false,
        commentNotifications: true,
    },
};

export default function SettingsPage() {
    const [settings, setSettings] =
        useState<UserSettings>(defaultSettings);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Sign out 
    async function handleSignOut() {
    const response = await fetch(
        `${API_URL}/api/auth/sign-out`,
        {
            method: "POST",
            credentials: "include",
        }
    );

        if (!response.ok) {
            throw new Error("Failed to sign out.");
        }
    }

    // Load settings from backend
    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to load settings.");
                }

                const user: UserProfileResponse = await response.json();

                setSettings({
                    academic: {
                        college:
                            (user.college_id !== null
                                ? collegeCodes[user.college_id]
                                : undefined) || "CCS",
                        course: user.program ?? "",
                        batchId: user.batch_id?.toString() ?? "",
                    },
                    notifications: {
                        inAppNotifications: user.in_app_notifications,
                        emailNotifications: user.email_notifications,
                        commentNotifications: user.comment_notifications,
                    },
                });
            } catch (error) {
                console.error("Failed to load settings:", error);
                setSaveError("Unable to load your settings. Please refresh the page.");
            } finally {
                setIsLoaded(true);
            }
        }

        fetchSettings();
    }, []);

    /**
     * Updates academic information in the parent state.
     */
    function handleAcademicChange(data: AcademicSettingsData) {
        setSettings((previous) => ({
            ...previous,
            academic: data,
        }));

        setIsSaved(false);
        setSaveError(null);
    }

    /**
     * Updates notification preferences in the parent state.
     */
    function handleNotificationChange(
        data: NotificationSettingsData
    ) {
        setSettings((previous) => ({
            ...previous,
            notifications: data,
        }));

        setIsSaved(false);
        setSaveError(null);
    }

    // Save settings to backend
    async function handleSaveChanges() {
        setIsSaving(true);
        setIsSaved(false);
        setSaveError(null);

        try {
            const collegeId = collegeIds[settings.academic.college];

            if (!collegeId) {
                throw new Error("Please select a valid college.");
            }

            const response = await fetch(`${API_URL}/users/me`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    college_id: collegeId,
                    program: settings.academic.course,
                    batch_id: Number(settings.academic.batchId),
                    in_app_notifications:
                        settings.notifications.inAppNotifications,
                    email_notifications:
                        settings.notifications.emailNotifications,
                    comment_notifications:
                        settings.notifications.commentNotifications,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || "Unable to save your settings."
                );
            }

            setIsSaved(true);
        } catch (error) {
            console.error("Failed to save settings:", error);

            setSaveError(
                error instanceof Error
                    ? error.message
                    : "Unable to save your settings. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <MainLayout>
            <div className="relative min-h-screen px-6 py-8">
                {/* Centered Settings Container */}
                <div
                    className="relative left-[calc(50%-104px)]
                    w-full max-w-150 -translate-x-1/2"
                >

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-[#343B36]">
                            User Settings
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage your academic information, notification
                            preferences, and account settings.
                        </p>
                    </div>

                    {/* Settings Card */}
                    <div className="rounded-sm border border-gray-200 bg-white p-6">
                        {isLoaded ? (
                            <>
                                {/* Academic Information */}
                                <AcademicSettings
                                    initialData={settings.academic}
                                    onChange={handleAcademicChange}
                                />

                                <div className="my-8 border-t border-gray-200" />
                                {/* Notification Preferences */}
                                <NotificationSettings
                                    initialData={settings.notifications}
                                    onChange={handleNotificationChange}
                                />

                                <div className="my-8 border-t border-gray-200" />
                                {/* Account Management */}
                                <AccountSettings onSignOut={handleSignOut} />
                                {/* Save Changes */}
                                <div
                                    className="mt-8 flex items-center
                                    justify-end gap-4 border-t
                                    border-gray-200 pt-6"
                                >
                                    {isSaved && (
                                        <p
                                            role="status"
                                            className="text-sm text-[#00A651]"
                                        >
                                            Changes saved successfully!
                                        </p>
                                    )}

                                    {saveError && (
                                        <p
                                            role="alert"
                                            className="text-sm text-red-600"
                                        >
                                            {saveError}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSaveChanges}
                                        disabled={isSaving}
                                        className="rounded-md bg-[#00A651]
                                        px-6 py-2.5 text-sm font-semibold
                                        text-white transition-colors
                                        hover:bg-[#008F45]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-500">
                                Loading settings...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
