"use client";

import { useState, type ReactNode } from "react";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

import PostNotesModal from "@/components/posts/post-notes-modal";
import { PostsProvider } from "@/context/posts-context";

interface MainLayoutProps {
  	children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  	const [postNotesOpen, setPostNotesOpen] = useState(false);

	return (
		<PostsProvider>
			<div className="min-h-screen bg-white">

				{/* Sticky Navbar */}
				<div className="sticky top-0 z-50 bg-white">
					<Navbar />
				</div>

				<div className="flex">

					{/* Independently Scrollable Sidebar */}
					<div className="sidebar-scroll sticky top-[66px] h-[calc(100vh-66px)] shrink-0 overflow-y-auto">
						<Sidebar
							onOpenPostNotes={() => setPostNotesOpen(true)}
						/>
					</div>

					{/* Main Content */}
					<main className="min-w-0 flex-1">
						{children}
					</main>

				</div>

				{/* Post Notes Modal */}
				{postNotesOpen && (
					<PostNotesModal
						onClose={() => setPostNotesOpen(false)}
					/>
				)}
			</div>
		</PostsProvider>
	);
}