
"use client";

import { useState } from "react";
import Image from "next/image";

const initialRecentPosts = [
  {
    id: 1,
    name: "John Doe",
    course: "STALGCM",
    title: "Midterms Reviewer",
  },
  {
    id: 2,
    name: "Carmy Berzatto",
    course: "CS1130",
    title: "Notes for Intro to Computing",
  },
  {
    id: 3,
    name: "Carmy Berzatto",
    course: "CS1131",
    title: "Notes for Fundamentals of Programming",
  },
];

export default function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState(initialRecentPosts);

  return (
    <aside className="w-full rounded-sm border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Recent Posts
        </h2>

        <button
          type="button"
          onClick={() => setRecentPosts([])}
          className="text-sm text-red-500 hover:underline"
        >
          Clear
        </button>
      </div>

      {recentPosts.length === 0 ? (
        <p className="py-5 text-center text-xs text-gray-500">
          No recent posts.
        </p>
      ) : (
        recentPosts.map((post) => (
          <div
            key={post.id}
            className="border-b border-gray-200 py-5 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/profile.svg"
                alt=""
                width={35}
                height={35}
              />

              <div>
                <h3 className="text-sm font-semibold">
                  {post.name}
                </h3>
                <p className="text-xs">{post.course}</p>
              </div>
            </div>

            <p className="ml-4 mt-3 text-xs font-semibold">
              {post.title}
            </p>
          </div>
        ))
      )}
    </aside>
  );
}