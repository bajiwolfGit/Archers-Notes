"use client";

import { useState, type ReactNode } from "react";

import Navbar from "./navbar";

import Sidebar from "./sidebar";

import PostNotesModal from "@/components/posts/post-notes-modal";

import { PostsProvider, usePosts } from "@/context/posts-context";

import { QuizzesProvider } from "@/context/quizzes-context";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <PostsProvider>
            <QuizzesProvider>
                <MainLayoutContent>{children}</MainLayoutContent>
            </QuizzesProvider>
        </PostsProvider>
    );
}

function MainLayoutContent({ children }: MainLayoutProps) {
    
    const [postNotesOpen, setPostNotesOpen] = useState(false);

    const {
		editingPost,
		closeEditPost,
		editingDraft,
		closeEditDraft,
	} = usePosts();

    function handleOpenPostNotes() {

        closeEditPost();
        
        closeEditDraft();
        
        setPostNotesOpen(true);
    }

    function handleCloseModal() {
        
        setPostNotesOpen(false);
		
        closeEditPost();
		
        closeEditDraft();
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="sticky top-0 z-50 bg-white">
                <Navbar />
            </div>

            <div className="flex">

                <div className="sidebar-scroll sticky top-16.5 h-[calc(100vh-66px)] shrink-0 overflow-y-auto">
                    <Sidebar
                        onOpenPostNotes={handleOpenPostNotes}
                    />
                </div>

                <main className="min-w-0 flex-1">
                    {children}
                </main>

            </div>

            {(postNotesOpen || editingPost || editingDraft) && (
                <PostNotesModal
                    
					key={
						editingPost
							? `post-${editingPost.id}`
							: editingDraft
							? `draft-${editingDraft.id}`
							: "new"
					}

					editingPost={editingPost}
					
                    editingDraft={editingDraft}
					
                    onClose={handleCloseModal}
				/>
			)}

        </div>
    );
}