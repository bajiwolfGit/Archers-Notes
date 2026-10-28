/**
 * File: components/posts/notes-editor.tsx
 *
 * Description:
 * Provides a reusable rich-text editor for creating and editing
 * notes in the Archer's Notes application.
 *
 * Uses the shared RichTextEditor component configured specifically
 * for writing notes and managing file attachments.
 *
 * Features:
 * - Displays a rich-text editor for composing notes.
 * - Supports creating and editing formatted note content.
 * - Supports attaching files to notes.
 * - Converts editor attachments into File objects.
 * - Notifies the parent component when content or attachments change.
 * - Supports resetting the editor through a reset key.
 * - Reuses the RichTextEditor component in notes mode.
 */

"use client";

// React hook for memoizing callback functions between component renders.
import { useCallback } from "react";

// Import the reusable rich-text editor component and its attachment type.
import RichTextEditor, {
    type EditorAttachment,
} from "@/components/ui/rich-text-editor";

/**
 * NotesEditorProps Interface
 *
 * Defines the properties required by the NotesEditor component.
 *
 * @property content - The current HTML content displayed in the editor.
 * @property onChange - Callback function executed when the editor
 *                      content changes. Receives the updated content.
 * @property onAttachmentsChange - Callback function executed when
 *                                 attachments change. Receives an
 *                                 array of File objects.
 * @property resetKey - Numeric value passed to RichTextEditor
 *                      to control its reset behavior.
 */
interface NotesEditorProps {
    content: string;
    onChange: (content: string) => void;
    onAttachmentsChange: (files: File[]) => void;
    resetKey: number;
}

/**
 * NotesEditor Component
 *
 * Provides a rich-text editing interface for creating
 * and modifying notes.
 *
 * Uses the shared RichTextEditor component with the
 * "notes" variant to display the appropriate editing
 * interface for note creation.
 *
 * The component receives its content and event handlers
 * from the parent component rather than managing its
 * own content state.
 *
 * It also processes editor attachments by extracting
 * their File objects before passing them to the parent.
 *
 * @param content - Current HTML content of the note.
 * @param onChange - Function called when the note content changes.
 * @param onAttachmentsChange - Function called when attachments change.
 * @param resetKey - Value used to control editor resets.
 * @returns A RichTextEditor configured for writing notes.
 */
export default function NotesEditor({
    content,
    onChange,
    onAttachmentsChange,
    resetKey,
}: NotesEditorProps) {

    /**
     * handleAttachmentsChange
     *
     * Processes attachment updates received from RichTextEditor.
     *
     * RichTextEditor provides attachments as an array of
     * EditorAttachment objects. This function extracts
     * the File object from each attachment.
     *
     * The resulting File array is then passed to the
     * parent component through onAttachmentsChange.
     *
     * useCallback memoizes the function so its reference
     * remains stable between renders unless the
     * onAttachmentsChange dependency changes.
     *
     * @param attachments - Array of EditorAttachment objects.
     * @returns void
     */
    const handleAttachmentsChange = useCallback(
        (attachments: EditorAttachment[]) => {

            // Extract the File object from each editor attachment.
            // Pass the resulting array to the parent component.
            onAttachmentsChange(
                attachments.map((attachment) => attachment.file)
            );
        },
        [onAttachmentsChange]
    );

    return (

        /*
         * Notes Rich-Text Editor:
         * Displays the reusable RichTextEditor component
         * configured for note creation and editing.
         *
         * Configuration:
         * - variant: Enables the notes editing interface.
         * - placeholder: Displays instructional text when empty.
         * - content: Provides the current note content.
         * - onChange: Forwards content updates to the parent.
         * - onAttachmentsChange: Processes attachment updates.
         * - resetKey: Passes the reset value to RichTextEditor.
         */
        <RichTextEditor
            variant="notes"
            placeholder="Write your notes here..."
            content={content}
            onChange={onChange}
            onAttachmentsChange={handleAttachmentsChange}
            resetKey={resetKey}
        />
    );
}