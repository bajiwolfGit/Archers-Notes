
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import RecentPosts from "@/components/home/recent-posts";
import PostCard from "@/components/home/post-card";
import { usePosts } from "@/context/posts-context";

type SearchSort = "Relevant" | "Latest" | "Trending";
type SearchTab = "All" | "Notes" | "Courses" | "People";

export default function SearchPage() {
    return (
        <MainLayout>
            <SearchResults />
        </MainLayout>
    );
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.trim() ?? "";
    const normalizedQuery = query.toLowerCase();

    const { posts } = usePosts();

    // Search category and sorting states.
    const [activeTab, setActiveTab] = useState<SearchTab>("All");
    const [sortBy, setSortBy] = useState<SearchSort>("Relevant");
    const [sortOpen, setSortOpen] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);

    // Close the sorting dropdown when clicking outside.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sortRef.current &&
                !sortRef.current.contains(event.target as Node)
            ) {
                setSortOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Search notes by title, content, course, or author.
    const noteResults = posts.filter((post) => {
        if (!normalizedQuery) return false;

        const searchableText = [
            post.title,
            post.content,
            post.course,
            post.name,
        ]
            .filter(Boolean)
            .join(" ")
            .replace(/<[^>]*>/g, " ")
            .toLowerCase();

        return searchableText.includes(normalizedQuery);
    });

    // Find unique matching course codes from existing posts.
    const courseResults = Array.from(
        new Set(
            posts
                .map((post) => post.course?.trim())
                .filter(
                    (course): course is string => Boolean(course)
                )
        )
    ).filter(
        (course) =>
            normalizedQuery.length > 0 &&
            course.toLowerCase().includes(normalizedQuery)
    );

    // Find unique matching authors from existing posts.
    const peopleResults = Array.from(
        new Map(
            posts
                .filter((post) => post.authorId != null)
                .map((post) => [
                    post.authorId,
                    {
                        id: post.authorId,
                        name: post.name,
                    },
                ])
        ).values()
    ).filter(
        (person) =>
            normalizedQuery.length > 0 &&
            person.name.toLowerCase().includes(normalizedQuery)
    );

    // Sort matching notes without modifying PostsContext.
    const sortedResults = [...noteResults].sort((a, b) => {
        if (sortBy === "Trending") {
            return b.likes - a.likes;
        }

        if (sortBy === "Latest") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }

        // Prioritize title matches for relevance.
        const aTitleMatch = a.title
            .toLowerCase()
            .includes(normalizedQuery);

        const bTitleMatch = b.title
            .toLowerCase()
            .includes(normalizedQuery);

        return Number(bTitleMatch) - Number(aTitleMatch);
    });

    // Calculate total and currently visible results.
    const totalResults =
        noteResults.length +
        courseResults.length +
        peopleResults.length;

    const visibleCount =
        activeTab === "Notes"
            ? noteResults.length
            : activeTab === "Courses"
            ? courseResults.length
            : activeTab === "People"
            ? peopleResults.length
            : totalResults;

    // Determine which result sections should be visible.
    const showNotes =
        activeTab === "All" || activeTab === "Notes";

    const showCourses =
        activeTab === "All" || activeTab === "Courses";

    const showPeople =
        activeTab === "All" || activeTab === "People";

    return (
        <div className="relative w-full px-6 py-6">
            {/* Centered Search Results */}
            <div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-[#343B36]">
                        Search Results
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                            {query ? (
                                <>
                                    Results for{" "}
                                    <span className="font-semibold text-[#00A651]">
                                        &quot;{query}&quot;
                                    </span>
                                </>
                            ) : (
                                "Enter a keyword to search."
                            )}
                        </p>

                        {/* Custom Sort Dropdown */}
                        {query && (
                            <div
                                ref={sortRef}
                                className={`relative ${
                                    showNotes && noteResults.length > 0
                                        ? ""
                                        : "invisible pointer-events-none"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSortOpen(!sortOpen)}
                                    aria-label="Sort search results"
                                    aria-expanded={sortOpen}
                                    aria-haspopup="true"
                                    className={`flex min-w-[150px] items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-xs font-medium text-[#343B36] transition-all duration-200 hover:border-[#00A651] ${
                                        sortOpen
                                            ? "border-[#00A651] shadow-sm"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <span>
                                        {sortBy === "Relevant"
                                            ? "Most Relevant"
                                            : sortBy}
                                    </span>

                                    <Image
                                        src="/assets/icons/dropdown.svg"
                                        alt=""
                                        width={12}
                                        height={12}
                                    />
                                </button>

                                {sortOpen && (
                                    <div className="absolute right-0 top-full z-30 mt-2 w-[170px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                                        {(["Relevant", "Latest", "Trending"] as const).map(
                                            (option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => {
                                                        setSortBy(option);
                                                        setSortOpen(false);
                                                    }}
                                                    className={`flex w-full rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                                                        sortBy === option
                                                            ? "bg-[#EAF8EF] font-semibold text-[#00A651]"
                                                            : "text-[#343B36] hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {option === "Relevant"
                                                        ? "Most Relevant"
                                                        : option}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Category Tabs */}
                <div className="mb-5 flex border-b border-gray-200">
                    {(["All", "Notes", "Courses", "People"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab);
                                    setSortOpen(false);
                                }}
                                className={`flex-1 border-b-2 px-2 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab
                                        ? "border-[#00A651] text-[#00A651]"
                                        : "border-transparent text-gray-500 hover:text-[#343B36]"
                                }`}
                            >
                                {tab}
                            </button>
                        )
                    )}
                </div>

                {/* Search Results Content */}
                {!query ? (
                    <div className="py-16 text-center">
                        <h2 className="text-base font-semibold text-[#343B36]">
                            Search for notes
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Use the search bar above to find notes,
                            courses, or people.
                        </p>
                    </div>
                ) : visibleCount === 0 ? (
                    <div className="py-16 text-center">
                        <h2 className="text-base font-semibold text-[#343B36]">
                            No results found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try searching with a different keyword,
                            course, or author.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">

                        {/* Notes Results */}
                        {showNotes && noteResults.length > 0 && (
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-[#343B36]">
                                        Notes
                                    </h2>

                                    <span className="text-xs text-gray-500">
                                        {noteResults.length}{" "}
                                        {noteResults.length === 1
                                            ? "result"
                                            : "results"}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {sortedResults.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Course Results */}
                        {showCourses && courseResults.length > 0 && (
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-[#343B36]">
                                        Courses
                                    </h2>

                                    <span className="text-xs text-gray-500">
                                        {courseResults.length}{" "}
                                        {courseResults.length === 1
                                            ? "result"
                                            : "results"}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {courseResults.map((course) => (
                                        <Link
                                            key={course}
                                            href={`/main?course=${encodeURIComponent(course)}`}
                                            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#00A651]"
                                        >
                                            <p className="text-sm font-semibold text-[#343B36]">
                                                {course}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                View notes for this course
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* People Results */}
                        {showPeople && peopleResults.length > 0 && (
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-[#343B36]">
                                        People
                                    </h2>

                                    <span className="text-xs text-gray-500">
                                        {peopleResults.length}{" "}
                                        {peopleResults.length === 1
                                            ? "result"
                                            : "results"}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {peopleResults.map((person) => (
                                        <Link
                                            key={person.id}
                                            href={
                                                person.id === 1
                                                    ? "/profile"
                                                    : `/profile/${person.id}`
                                            }
                                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#00A651]"
                                        >
                                            <Image
                                                src="/assets/icons/profile.svg"
                                                alt=""
                                                width={36}
                                                height={36}
                                                className="shrink-0"
                                            />

                                            <div>
                                                <p className="text-sm font-semibold text-[#343B36]">
                                                    {person.name}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    View Profile
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Posts Section */}
            <div className="absolute right-6 top-6 hidden w-[225px] xl:block">
                <RecentPosts />
            </div>
        </div>
    );
}