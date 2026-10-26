"use client";

import { useState } from "react";
import Image from "next/image";

import MainLayout from "@/components/layout/main-layout";
import ProfileAbout from "@/components/profile/profile-about";
import PostCard, { type Post } from "@/components/home/post-card";

import type { ProfileData } from "@/components/profile/profile-types";

const janeProfile: ProfileData = {
  name: "Jane Doe",
  email: "jane_doe@dlsu.edu.ph",
  subtitle: "COB Student",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  courses: ["FNDACCT"],
  avatar: null,
  cover: null,
};

const janePosts: Post[] = [
  {
    id: 2,
    authorId: 2,
    name: "Jane Doe",
    course: "FNDACCT",
    time: "2 days ago",
    title: "Lorem Ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
      "Reprehenderit neque ab aliqua ipsam consequuntur reprehenderit " +
      "doloremque architecto beatae elit consectetur.\n\n" +
      "Architecto officia totam nostrum voluptas ipsam eum fugiat " +
      "enim sit error incidunt porro.\n\n" +
      "Et ullamco dolorem deserunt quas duis velit laborum qui " +
      "ratione culpa.",
    images: [],
    likes: 0,
    comments: 0,
    createdAt: "2026-10-24",
  },
];

export default function OtherProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(50);

  function handleFollow() {
    setIsFollowing((previous) => !previous);
    setFollowers((previous) =>
      isFollowing ? previous - 1 : previous + 1
    );
  }

  return (
    <MainLayout>
      <div className="w-full px-6 py-5">

        {/* Profile Cover */}
        <div className="relative">
          <div className="relative h-[125px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#F6FCF9] to-[#CBEFDD]">
            {janeProfile.cover && (
              <Image
                src={janeProfile.cover}
                alt="Cover"
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
              {janeProfile.avatar ? (
                <Image
                  src={janeProfile.avatar}
                  alt="Jane Doe"
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/assets/icons/profile.svg"
                  alt="Profile"
                  width={70}
                  height={70}
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-3 flex items-start justify-between gap-4 pl-[145px]">

          <div>
            <h1 className="text-base font-semibold text-[#343B36]">
              {janeProfile.name}
            </h1>

            <p className="mt-1 text-xs text-gray-600">
              {janeProfile.email}
            </p>

            <p className="mt-2 text-xs text-gray-700">
              {janeProfile.subtitle}
            </p>
          </div>

          {/* Follow Button */}
          <button
            type="button"
            onClick={handleFollow}
            aria-pressed={isFollowing}
            className={`min-w-[125px] rounded-full px-6 py-2 text-xs font-semibold transition ${
              isFollowing
                ? "border border-[#00A651] bg-white text-[#00A651]"
                : "bg-[#00A651] text-white hover:bg-[#008C45]"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Account Information */}
        <div className="mt-8 ml-[70px]">
          <div className="flex items-center gap-3 text-sm text-[#343B36]">
            <Image
              src="/assets/icons/calendar-black.svg"
              alt=""
              width={24}
              height={24}
            />

            <span>Joined October 2024</span>
          </div>

          <div className="mt-3 flex gap-5 text-sm text-[#343B36]">
            <span>16 Following</span>
            <span>{followers} Followers</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 ml-[70px] w-[calc(100%-380px)] border-t border-gray-200" />

        {/* Profile Content */}
        <div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">

          {/* Posts */}
          <div className="min-w-0">
            <div className="mx-auto w-full max-w-[480px] space-y-5">
              {janePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* About Panel */}
          <div className="-mt-[110px] min-w-0">
            <ProfileAbout profile={janeProfile} />
          </div>

        </div>
      </div>
    </MainLayout>
  );
}