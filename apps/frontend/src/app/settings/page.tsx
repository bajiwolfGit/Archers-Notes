
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

const STORAGE_KEY = "archers-notes-user-settings";

const defaultAcademicSettings: AcademicSettingsData = {
    college: "CCS",
    course: "Computer Science Major in Software Technology",
    batchId: "128",
};

const defaultNotificationSettings: NotificationSettingsData = {
    inAppNotifications: true,
    emailNotifications: false,
    commentNotifications: true,
};

const defaultSettings: UserSettings = {
    academic: defaultAcademicSettings,
    notifications: defaultNotificationSettings,
};

/**
 * Loads previously saved settings from localStorage.
 * Falls back to default settings if no saved data exists.
 */
function loadSettings(): UserSettings {
    try {
        const storedSettings = localStorage.getItem(STORAGE_KEY);

        if (!storedSettings) {
            return defaultSettings;
        }

        const parsed = JSON.parse(storedSettings) as
        Partial<UserSettings>;

        return {
            academic: {
                ...defaultAcademicSettings,
                ...parsed.academic,
            },
            notifications: {
                ...defaultNotificationSettings,
                ...parsed.notifications,
            },
        };
    } catch (error) {
        console.error("Failed to load settings:", error);
        return defaultSettings;
    }
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(
        null
    );

    /**
     * Loads saved settings after the component mounts.
     * Prevents hydration mismatches in Next.js.
     */
    useEffect(() => {
        setSettings(loadSettings());
        setIsLoaded(true);
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

    /**
     * Saves all settings to localStorage.
     */
    function handleSaveChanges() {
        setIsSaving(true);
        setIsSaved(false);
        setSaveError(null);

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

            setIsSaved(true);
        } catch (error) {
            console.error("Failed to save settings:", error);

            setSaveError(
                "Unable to save your settings. Please try again."
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
                                <AccountSettings />

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