"use client";

import RichTextEditor, {
  	type EditorAttachment,
} from "@/components/ui/rich-text-editor";

export type CommentAttachment = EditorAttachment;

interface CommentEditorProps {
	onSubmit: (
		html: string,
		attachments: CommentAttachment[]
	) => void;
}

export default function CommentEditor({
  	onSubmit,
}: CommentEditorProps) {
	return (
		<RichTextEditor
			variant="comment"
			placeholder="Join the conversation"
			onSubmit={onSubmit}
		/>
	);
}