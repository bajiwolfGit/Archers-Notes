
import PostCard, { type Post } from "./post-card";

const posts: Post[] = [
  {
    id: 1,
    name: "John Doe",
    course: "STALGCM",
    time: "3 days ago",
    title: "Midterms Reviewer",
    content: "Here are some notes for Midterms!",
    image: "/assets/images/mock/sample-notes.png",
    likes: 67,
    comments: 22,
    createdAt: "2026-10-20",
  },
  {
    id: 2,
    name: "Jane Doe",
    course: "FNDACCT",
    time: "2 days ago",
    title: "Lorem Ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Repellendus neque ab aliqua ipsam consequuntur.\n\nArchitecto officia totam nostrum voluptas sunt animi fugiat enim sit error incidunt porro.",
    likes: 35,
    comments: 8,
    createdAt: "2026-10-21",
  },
];

interface NotesFeedProps {
  sortBy: "Trending" | "Latest";
}

export default function NotesFeed({ sortBy }: NotesFeedProps) {
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "Trending") {
      return b.likes - a.likes;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return (
    <div className="space-y-6">
      {sortedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
