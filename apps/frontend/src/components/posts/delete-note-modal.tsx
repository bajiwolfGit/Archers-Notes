/**
 * File: components/posts/delete-note-modal.tsx
 *
 * Description:
 * Provides a confirmation modal for deleting notes in the
 * Archer's Notes application.
 *
 * Displays a confirmation message and allows users to
 * either close the modal or confirm the deletion.
 *
 * Features:
 * - Displays a confirmation dialog before deleting a note.
 * - Allows users to close the modal without deleting.
 * - Provides a Delete button to confirm the action.
 * - Uses React Portal to render the modal outside its parent component.
 * - Displays a dark overlay behind the confirmation dialog.
 * - Supports accessible dialog attributes.
 * - Prevents rendering when the modal is closed.
 */

"use client";

// Next.js component for optimized image rendering.
import Image from "next/image";

// React DOM function for rendering elements outside their parent DOM hierarchy.
import { createPortal } from "react-dom";

/**
 * DeleteNoteModalProps Interface
 *
 * Defines the properties required by the DeleteNoteModal component.
 *
 * @property isOpen - Determines whether the confirmation modal is visible.
 * @property onClose - Callback function executed when the user closes the modal.
 * @property onConfirm - Callback function executed when the user confirms deletion.
 */
interface DeleteNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * DeleteNoteModal Component
 *
 * Displays a confirmation dialog before deleting a note.
 *
 * The component receives its visibility state and event
 * handlers from the parent component.
 *
 * When the user clicks the close button, the onClose
 * callback is executed.
 *
 * When the user clicks the Delete button, the onConfirm
 * callback is executed.
 *
 * The component does not directly delete notes.
 * The parent component is responsible for performing
 * the actual deletion.
 *
 * Uses createPortal to render the modal directly inside
 * document.body, allowing it to appear above other
 * application elements.
 *
 * @param isOpen - Controls whether the modal is displayed.
 * @param onClose - Function called when the modal is closed.
 * @param onConfirm - Function called when deletion is confirmed.
 * @returns The delete confirmation modal, or null when hidden.
 */
export default function DeleteNoteModal({
    isOpen,
    onClose,
    onConfirm,
}: DeleteNoteModalProps) {

    /**
     * Conditional Rendering
     *
     * Prevents the modal from rendering when:
     * - isOpen is false.
     * - The document object is unavailable.
     *
     * Checking for document ensures that the portal
     * is only created in a browser environment.
     */
    if (!isOpen || typeof document === "undefined") return null;

    /**
     * React Portal
     *
     * Renders the confirmation modal directly inside
     * document.body instead of its parent component.
     *
     * This allows the modal to use fixed positioning
     * independently of the parent's layout structure.
     */
    return createPortal(

        /*
         * Modal Overlay:
         * Covers the entire viewport with a semi-transparent
         * black background.
         *
         * Uses fixed positioning and a high z-index
         * to display the modal above other page elements.
         *
         * Flexbox centers the confirmation dialog
         * horizontally and vertically.
         */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            
            {/*
             * Confirmation Dialog:
             * Contains the close button, confirmation
             * message, and Delete button.
             *
             * The role="dialog" attribute identifies
             * the element as a dialog.
             *
             * The aria-modal="true" attribute indicates
             * that the dialog is intended to be modal.
             *
             * The aria-labelledby attribute associates
             * the dialog with its confirmation message.
             */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-note-title"
                className="relative w-full max-w-[500px] rounded-[30px] bg-white px-6 py-6"
            >
                {/*
                 * Close Button:
                 * Allows users to dismiss the confirmation
                 * dialog without deleting the note.
                 *
                 * Calls the onClose callback provided
                 * by the parent component.
                 *
                 * Uses absolute positioning to place
                 * the button in the upper-left corner.
                 */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute left-5 top-5 text-xl text-gray-700 hover:opacity-60"
                >
                    <Image
                        src="/assets/icons/exit.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="object-contain"
                    />
                </button>

                {/*
                 * Confirmation Message:
                 * Asks the user to confirm whether
                 * they want to delete the selected note.
                 *
                 * The ID is referenced by aria-labelledby
                 * to provide an accessible dialog label.
                 */}
                <p
                    id="delete-note-title"
                    className="mt-12 text-center text-sm font-semibold"
                >
                    Are you sure you want to delete this note?
                </p>

                {/*
                 * Delete Action Container:
                 * Positions the confirmation button
                 * on the right side of the dialog.
                 */}
                <div className="mt-7 flex justify-end">
                    
                    {/*
                     * Delete Button:
                     * Confirms the user's intention
                     * to delete the selected note.
                     *
                     * Calls the onConfirm callback
                     * provided by the parent component.
                     *
                     * The actual deletion logic is handled
                     * outside this component.
                     */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-[120px] rounded-full bg-[#FF7075] px-6 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}