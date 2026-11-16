
"use client";

import { useState } from "react";

/**
 * File: components/settings/notification-settings.tsx
 *
 * Description:
 * Allows users to manage their notification preferences
 * for the Archer's Notes application.
 *
 * Features:
 * - Enable or disable in-app notifications.
 * - Enable or disable email notifications.
 * - Enable or disable comment and reply notifications.
 * - Notify the parent component when preferences change.
 */

export interface NotificationSettingsData {
  inAppNotifications: boolean;
  emailNotifications: boolean;
  commentNotifications: boolean;
}

interface NotificationSettingsProps {
  initialData?: NotificationSettingsData;
  onChange?: (data: NotificationSettingsData) => void;
}

const defaultSettings: NotificationSettingsData = {
  inAppNotifications: true,
  emailNotifications: false,
  commentNotifications: true,
};

export default function NotificationSettings({
  initialData = defaultSettings,
  onChange,
}: NotificationSettingsProps) {
  const [settings, setSettings] =
    useState<NotificationSettingsData>(initialData);

  function handleToggle(
    field: keyof NotificationSettingsData
  ) {
    const updatedSettings = {
      ...settings,
      [field]: !settings[field],
    };

    setSettings(updatedSettings);
    onChange?.(updatedSettings);
  }

  const notificationOptions: {
    id: keyof NotificationSettingsData;
    title: string;
    description: string;
  }[] = [
    {
      id: "inAppNotifications",
      title: "In-App Notifications",
      description:
        "Receive notifications within Archer's Notes.",
    },
    {
      id: "emailNotifications",
      title: "Email Notifications",
      description:
        "Receive important updates through your registered email.",
    },
    {
      id: "commentNotifications",
      title: "Comments and Replies",
      description:
        "Get notified when someone comments on your notes or replies to your comments.",
    },
  ];

    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#343B36]">
                Notification Preferences
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                Choose which notifications you would like to receive.
                </p>
            </div>

            {/* Notification Options */}
            <div className="divide-y divide-gray-200">
                {notificationOptions.map((option) => (
                    <div
                        key={option.id}
                        className="flex items-center justify-between gap-6 py-5"
                    >
                        {/* Notification Details */}
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-[#343B36]">
                                {option.title}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                {option.description}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings[option.id]}
                            aria-label={option.title}
                            onClick={() => handleToggle(option.id)}
                            className={`relative h-6 w-11 shrink-0 rounded-full
                                transition-colors duration-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#00A651]
                                focus-visible:ring-offset-2
                                ${
                                settings[option.id]
                                    ? "bg-[#00A651]"
                                    : "bg-gray-300"
                                }`}
                        >
                        <span
                            className={`absolute left-1 top-1 h-4 w-4
                            rounded-full bg-white shadow-sm
                            transition-transform duration-200
                            ${
                                settings[option.id]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                        />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
