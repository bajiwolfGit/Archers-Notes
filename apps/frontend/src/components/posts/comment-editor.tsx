/**
 * File: components/posts/comment-editor.tsx
 *
 * Description:
 * Provides a reusable comment editor for the Archer's Notes
 * application. Uses the shared RichTextEditor component
 * configured specifically for writing and submitting comments.
 *
 * Features:
 * - Displays a rich-text editor for composing comments.
 * - Supports formatted comment content.
 * - Supports attachments through the shared editor.
 * - Passes submitted comment content and attachments
 *   to the parent component.
 * - Reuses the RichTextEditor component in comment mode.
 */

"use client";

// Import the reusable rich-text editor component and its attachment type.
import RichTextEditor, {
  	type EditorAttachment,
} from "@/components/ui/rich-text-editor";

/**
 * CommentAttachment Type
 *
 * Defines the attachment type used when submitting comments.
 *
 * Reuses the EditorAttachment type from RichTextEditor
 * to maintain consistency between the comment editor
 * and the shared rich-text editing component.
 */
export type CommentAttachment = EditorAttachment;

/**
 * CommentEditorProps Interface
 *
 * Defines the properties required by the CommentEditor component.
 *
 * @property onSubmit - Callback function executed when a comment
 *                      is submitted. Receives the comment's HTML
 *                      content and an array of attachments.
 */
interface CommentEditorProps {
	onSubmit: (
		html: string,
		attachments: CommentAttachment[]
	) => void;
}

/**
 * CommentEditor Component
 *
 * Provides a rich-text input interface for creating comments.
 *
 * Uses the shared RichTextEditor component with the
 * "comment" variant to display the appropriate editor
 * interface for comment submissions.
 *
 * The component does not directly store or submit comments.
 * Instead, it passes the submitted content and attachments
 * to the parent component through the onSubmit callback.
 *
 * @param onSubmit - Callback function for handling submitted comments.
 * @returns A RichTextEditor configured for writing comments.
 */
export default function CommentEditor({
  	onSubmit,
}: CommentEditorProps) {
	return (
		
		/*
		 * Comment Rich-Text Editor:
		 * Displays the reusable RichTextEditor component
		 * configured for comment creation.
		 *
		 * The "comment" variant determines the editor mode.
		 * The placeholder provides guidance before typing.
		 * The onSubmit callback forwards the submitted HTML
		 * content and attachments to the parent component.
		 */
		<RichTextEditor
			variant="comment"
			placeholder="Join the conversation"
			onSubmit={onSubmit}
		/>
	);
}