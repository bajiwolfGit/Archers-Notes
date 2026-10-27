"use client";

import { useCallback } from "react";

import RichTextEditor, {
    type EditorAttachment,
} from "@/components/ui/rich-text-editor";

interface NotesEditorProps {
    content: string;
    onChange: (content: string) => void;
    onAttachmentsChange: (files: File[]) => void;
    resetKey: number;
}

export default function NotesEditor({
    onChange,
    onAttachmentsChange,
    resetKey,
}: NotesEditorProps) {
    const handleAttachmentsChange = useCallback(
        (attachments: EditorAttachment[]) => {
            onAttachmentsChange(
            attachments.map((attachment) => attachment.file)
            );
        },
        [onAttachmentsChange]
    );

    return (
        <RichTextEditor
            variant="notes"
            placeholder="Write your notes here..."
            onChange={onChange}
            onAttachmentsChange={handleAttachmentsChange}
            resetKey={resetKey}
        />
    );
}