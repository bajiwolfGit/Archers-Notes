"use client";

import { useState } from "react";
import Image from "next/image";

import ProfileInfo from "./profile-info";
import EditProfileModal from "./edit-profile-modal";

import {
  initialProfile,
  type ProfileData,
} from "./profile-types";

interface ProfileHeaderProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

export default function ProfileHeader({
  profile,
  onProfileChange,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  function handleSave(updatedProfile: ProfileData) {
    onProfileChange(updatedProfile);
    setIsEditing(false);
  }

  return (
    <>
      <div className="w-full">
        {/* Cover and Profile Picture */}
        <div className="relative w-full">
          <div className="relative h-[125px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#F6FCF9] to-[#CBEFDD]">
            {profile.cover && (
              <Image
                src={profile.cover}
                alt="Profile cover"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-[62px] left-6">
            <div className="relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full bg-[#C7EBDD]">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={`${profile.name}'s profile picture`}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/assets/icons/profile.svg"
                  alt="Profile picture"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <ProfileInfo
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />

        {/* Divider */}
        <div className="mt-6 ml-[70px] w-[calc(100%-380px)] border-t border-gray-200" />
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}