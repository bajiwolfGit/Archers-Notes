/**
 * File: components/layout/main-layout.tsx
 *
 * Description:
 * Provides the shared application layout for the Archer's Notes
 * frontend. Organizes the navigation bar, sidebar, and main content
 * while managing the creation and editing of posts and drafts.
 *
 * Features:
 * - Provides a consistent layout across application pages.
 * - Displays a sticky navigation bar at the top of the page.
 * - Displays an independently scrollable sidebar.
 * - Renders page-specific content within the main content area.
 * - Provides access to the shared PostsContext.
 * - Manages the Create Post modal.
 * - Supports editing existing posts and saved drafts.
 * - Handles opening and closing the post editor.
 */

"use client";

// React hook for managing component state and type for renderable React content.
import { useState, type ReactNode } from "react";

// Component responsible for displaying the application's navigation bar.
import Navbar from "./navbar";

// Component responsible for displaying the application's sidebar navigation.
import Sidebar from "./sidebar";

// Modal component used for creating and editing posts and drafts.
import PostNotesModal from "@/components/posts/post-notes-modal";

// Context provider and hook for accessing shared post and draft management state.
import { PostsProvider, usePosts } from "@/context/posts-context";

/**
 * MainLayoutProps Interface
 *
 * Defines the properties required by the MainLayout and
 * MainLayoutContent components.
 *
 * @property children - Page-specific content rendered within the layout.
 */
interface MainLayoutProps {
    children: ReactNode;
}

/**
 * MainLayout Component
 *
 * Serves as the main layout wrapper for application pages.
 * Wraps the page content inside PostsProvider to make shared
 * post and draft management functionality available to
 * components within the layout.
 *
 * Delegates the rendering of the navigation bar, sidebar,
 * main content, and post editor to MainLayoutContent.
 *
 * @param children - Page-specific content to display.
 * @returns The application layout wrapped in PostsProvider.
 */
export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <PostsProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
        </PostsProvider>
    );
}

/**
 * MainLayoutContent Component
 *
 * Handles the visual structure and interactive functionality
 * of the shared application layout.
 *
 * Manages the Create Post modal through local React state
 * and accesses the shared PostsContext to determine whether
 * an existing post or draft is being edited.
 *
 * @param children - Page-specific content displayed in the main area.
 * @returns The shared layout and post creation/editing modal.
 */
function MainLayoutContent({ children }: MainLayoutProps) {
    
    /**
     * Post Notes Modal State
     *
     * Controls whether the Create Post modal is open.
     *
     * A true value indicates that the user has opened
     * the editor to create a new post.
     */
    const [postNotesOpen, setPostNotesOpen] = useState(false);

    /**
     * PostsContext
     *
     * Retrieves the currently selected post or draft being edited,
     * along with functions for clearing their editing states.
     *
     * editingPost: Contains the post currently being edited.
     * closeEditPost: Clears the active post editing state.
     * editingDraft: Contains the draft currently being edited.
     * closeEditDraft: Clears the active draft editing state.
     */
    const {
		editingPost,
		closeEditPost,
		editingDraft,
		closeEditDraft,
	} = usePosts();

    /**
     * handleOpenPostNotes
     *
     * Opens the post editor in Create Post mode.
     *
     * Clears any existing post or draft editing state
     * before opening the modal to ensure that the editor
     * starts with a new post rather than existing content.
     */
    function handleOpenPostNotes() {

        // Clear any previously selected post being edited.
        closeEditPost();
        
        // Clear any previously selected draft being edited.
        closeEditDraft();
        
        // Open the Create Post modal.
        setPostNotesOpen(true);
    }

    /**
     * handleCloseModal
     *
     * Closes the post editor and resets all editing states.
     *
     * Ensures that the next time the editor is opened,
     * it does not retain the previously selected post or draft.
     */
    function handleCloseModal() {
        
        // Close the Create Post modal.
        setPostNotesOpen(false);
		
        // Clear the active post editing state.
        closeEditPost();
		
        // Clear the active draft editing state.
        closeEditDraft();
    }

    return (
        /*
         * Main Layout Container:
         * Wraps the navigation bar, sidebar, main content,
         * and post creation/editing modal.
         *
         * Uses a minimum height equal to the viewport height.
         */
        <div className="min-h-screen bg-white">

            {/*
             * Sticky Navigation Bar:
             * Displays the application's main navigation bar.
             *
             * Uses sticky positioning to keep the navigation bar
             * visible at the top of the viewport while scrolling.
             *
             * The z-50 class ensures the navigation bar appears
             * above most other page elements.
             */}
            <div className="sticky top-0 z-50 bg-white">
                <Navbar />
            </div>

            {/*
             * Main Layout Structure:
             * Uses a flex container to position the sidebar
             * alongside the main page content.
             */}
            <div className="flex">

                {/*
                 * Independently Scrollable Sidebar:
                 * Displays the application's sidebar navigation.
                 *
                 * Uses sticky positioning to keep the sidebar
                 * visible beneath the navigation bar.
                 *
                 * The top offset of 66px accounts for the navbar height.
                 * The sidebar height is calculated as the viewport
                 * height minus the navigation bar height.
                 *
                 * The overflow-y-auto class allows the sidebar
                 * to scroll independently when its content exceeds
                 * the available vertical space.
                 *
                 * The sidebar-scroll class provides custom
                 * scrollbar styling defined elsewhere.
                 */}
                <div className="sidebar-scroll sticky top-[66px] h-[calc(100vh-66px)] shrink-0 overflow-y-auto">
                    <Sidebar
                        onOpenPostNotes={handleOpenPostNotes}
                    />
                </div>

                {/*
                 * Main Content Area:
                 * Displays the page-specific content passed
                 * through the children prop.
                 *
                 * Uses flex-1 to occupy the remaining horizontal
                 * space beside the sidebar.
                 *
                 * The min-w-0 class prevents flexbox content
                 * from forcing the main area beyond its available width.
                 */}
                <main className="min-w-0 flex-1">
                    {children}
                </main>

            </div>

            {/*
             * Create / Edit Post Modal:
             * Displays the PostNotesModal when:
             * - The user opens the Create Post interface.
             * - An existing post is selected for editing.
             * - A saved draft is selected for editing.
             *
             * The modal receives the selected post or draft
             * from PostsContext when editing existing content.
             */}
            {(postNotesOpen || editingPost || editingDraft) && (
                <PostNotesModal
                    
                    /*
                     * Modal Key:
                     * Assigns a unique key based on the editing mode.
                     *
                     * When editing a post, the key uses its post ID.
                     * When editing a draft, the key uses its draft ID.
                     * Otherwise, the key is set to "new".
                     *
                     * Changing the key causes React to recreate
                     * the modal component, resetting its local state.
                     */
					key={
						editingPost
							? `post-${editingPost.id}`
							: editingDraft
							? `draft-${editingDraft.id}`
							: "new"
					}

                    // Pass the selected post when editing an existing post.
					editingPost={editingPost}
					
                    // Pass the selected draft when editing a saved draft.
                    editingDraft={editingDraft}
					
                    // Close the modal and reset editing states when dismissed.
                    onClose={handleCloseModal}
				/>
			)}

        </div>
    );
}