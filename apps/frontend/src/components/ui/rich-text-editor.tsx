"use client";

import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import Image from "next/image";

import {
    EditorContent,
    useEditor,
    useEditorState,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";

export interface EditorAttachment {
    id: string;
    file: File;
}

interface RichTextEditorProps {
    variant?: "comment" | "notes";
    placeholder?: string;
    content?: string;
    onChange?: (html: string) => void;
    onAttachmentsChange?: (attachments: EditorAttachment[]) => void;
    onSubmit?: (
        html: string,
        attachments: EditorAttachment[]
    ) => void;
    resetKey?: number;
}

const TAB_SPACES = "\u00A0".repeat(4);

const TabIndentExtension = Extension.create({
    name: "tabIndent",

    addKeyboardShortcuts() {
        return {
            Tab: ({ editor }) => {
                // Indent list items normally
                if (editor.isActive("listItem")) {
                    return editor.commands.sinkListItem("listItem");
                }

                // Insert four spaces at the cursor
                return editor.commands.insertContent(TAB_SPACES);
            },

            "Shift-Tab": ({ editor }) => {
                // Outdent list items normally
                if (editor.isActive("listItem")) {
                    return editor.commands.liftListItem("listItem");
                }

                const { state, view } = editor;
                const { $from } = state.selection;

                const lineStart = $from.start();
                const cursorPosition = $from.pos;

                const textBeforeCursor = state.doc.textBetween(
                    lineStart,
                    cursorPosition,
                    "\n"
                );

                // Find the start of the current line
                const lastLineBreak = textBeforeCursor.lastIndexOf("\n");

                const currentLineStart =
                    lineStart + lastLineBreak + 1;

                const lineText = state.doc.textBetween(
                    currentLineStart,
                    Math.min(currentLineStart + 4, $from.end())
                );

                // Remove up to four leading spaces
                const spaces = lineText.match(/^[\u00A0 ]{1,4}/);

                if (spaces) {
                    const transaction = state.tr.delete(
                        currentLineStart,
                        currentLineStart + spaces[0].length
                    );

                    view.dispatch(transaction);
                }

                return true;
            },
        };
    },
});

export default function RichTextEditor({
    variant = "comment",
    placeholder = "Write something...",
    content = "",
    onChange,
    onAttachmentsChange,
    onSubmit,
    resetKey,
}: RichTextEditorProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [attachments, setAttachments] = useState<
        EditorAttachment[]
    >([]);

    const editor = useEditor({
        extensions: [
            StarterKit,

            ...(variant === "notes" ? [TabIndentExtension] : []),

            Placeholder.configure({
                placeholder,
            }),

            TiptapImage.configure({
                inline: false,
                allowBase64: true,
            }),
        ],

        content,
        immediatelyRender: false,

        editorProps: {
            attributes: {
                class:
                variant === "notes"
                    ? "min-h-[250px] w-full outline-none text-sm leading-7 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
                    : "min-h-[35px] w-full outline-none text-xs leading-relaxed",

                "aria-label":
                variant === "notes"
                    ? "Write your notes"
                    : "Write a comment",
            },
        },

        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    const formatting = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor?.isActive("bold") ?? false,
            italic: editor?.isActive("italic") ?? false,
            bulletList: editor?.isActive("bulletList") ?? false,
            orderedList: editor?.isActive("orderedList") ?? false,
            canUndo: editor?.can().undo() ?? false,
            canRedo: editor?.can().redo() ?? false,
        }),
    });

    // Reset editor when requested by parent
    const previousResetKey = useRef(resetKey);

    useEffect(() => {
        if (!editor) return;

        if (previousResetKey.current === resetKey) return;

        previousResetKey.current = resetKey;

        editor.commands.clearContent();
        setAttachments([]);
        onAttachmentsChange?.([]);
    }, [editor, resetKey, onAttachmentsChange]);

    async function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = Array.from(event.target.files ?? []).filter(
            (file) => file.type.startsWith("image/")
        );

        event.target.value = "";

        if (!editor || files.length === 0) return;

        try {
            const images = await Promise.all(
                files.map(
                    (file) =>
                        new Promise<{ src: string; alt: string }>(
                            (resolve, reject) => {
                                const reader = new FileReader();

                                reader.onload = () => {
                                    if (typeof reader.result === "string") {
                                        resolve({
                                            src: reader.result,
                                            alt: file.name,
                                        });
                                    } else {
                                        reject(new Error("Failed to read image."));
                                    }
                                };

                                reader.onerror = () => reject(reader.error);

                                reader.readAsDataURL(file);
                            }
                        )
                )
            );

            editor
                .chain()
                .focus()
                .insertContent(
                    images.map((image) => ({
                        type: "image",
                        attrs: {
                            src: image.src,
                            alt: image.alt,
                        },
                    }))
                )
                .run();
        } catch (error) {
            console.error("Failed to upload images:", error);
        }
    }

    // Add document attachments
    function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = Array.from(event.target.files ?? []);

        const newAttachments = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }));

        const updatedAttachments = [
            ...attachments,
            ...newAttachments,
        ];

        setAttachments(updatedAttachments);
        onAttachmentsChange?.(updatedAttachments);

        event.target.value = "";
    }

    function removeAttachment(id: string) {
        const updatedAttachments = attachments.filter(
            (attachment) => attachment.id !== id
        );

        setAttachments(updatedAttachments);
        onAttachmentsChange?.(updatedAttachments);
    }

    function clearEditor() {
        editor?.commands.clearContent();
        setAttachments([]);
        onChange?.("");
        onAttachmentsChange?.([]);
    }

    function handleSubmit() {
        if (!editor) return;

        if (editor.isEmpty && attachments.length === 0) return;

        onSubmit?.(editor.getHTML(), attachments);

        clearEditor();
    }

    const isNotes = variant === "notes";

    function ToolbarButton({
        label,
        title,
        active = false,
        disabled = false,
        onClick,
        children,
    }: {
        label: string;
        title?: string;
        active?: boolean;
        disabled?: boolean;
        onClick: () => void;
        children: ReactNode;
    }) {
        return (
            <button
                type="button"
                aria-label={label}
                title={title ?? label}
                aria-pressed={active}
                disabled={disabled}
                onClick={onClick}
                className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                active
                    ? "bg-green-100 ring-1 ring-[#00A651]"
                    : "hover:bg-gray-100"
                } disabled:cursor-not-allowed disabled:opacity-40`}
            >
                {children}
            </button>
        );
    }

    return (
        <div
            className={
                isNotes
                ? "flex min-h-[330px] flex-col rounded-md border border-gray-300 bg-white p-4"
                : "mt-6 rounded-md border border-gray-400 bg-white p-3"
            }
        >
            {/* Hidden Image Input */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                multiple
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Editor */}
            <div className={isNotes ? "min-h-[250px] flex-1" : ""}>
                <EditorContent editor={editor} />
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                    {attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium">
                                    {attachment.file.name}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                    {(attachment.file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                removeAttachment(attachment.id)
                                }
                                className="ml-3 text-xs text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Toolbar */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">

                <div className="flex flex-wrap items-center gap-3">

                    {/* Bold */}
                    <ToolbarButton
                        label="Bold"
                        title="Bold (Ctrl+B)"
                        active={formatting?.bold}
                        disabled={!editor}
                        onClick={() =>
                        editor?.chain().focus().toggleBold().run()
                        }
                    >
                        <Image
                            src="/assets/icons/textbox/bold.svg"
                            alt=""
                            width={10}
                            height={10}
                        />
                    </ToolbarButton>

                    {/* Italic */}
                    <ToolbarButton
                        label="Italic"
                        title="Italic (Ctrl+I)"
                        active={formatting?.italic}
                        disabled={!editor}
                        onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                        }
                    >
                        <Image
                            src="/assets/icons/textbox/italics.svg"
                            alt=""
                            width={10}
                            height={10}
                        />
                    </ToolbarButton>

                    {/* Bullet List */}
                    <ToolbarButton
                        label="Bullet list"
                        active={formatting?.bulletList}
                        disabled={!editor}
                        onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                        }
                    >
                        <Image
                            src="/assets/icons/textbox/bullet-list.svg"
                            alt=""
                            width={14}
                            height={14}
                        />
                    </ToolbarButton>

                    {/* Numbered List */}
                    <ToolbarButton
                        label="Numbered list"
                        active={formatting?.orderedList}
                        disabled={!editor}
                        onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <span className="text-xs font-semibold">
                            1.
                        </span>
                    </ToolbarButton>

                    {/* Undo */}
                    <ToolbarButton
                        label="Undo"
                        title="Undo (Ctrl+Z)"
                        disabled={!editor || !formatting?.canUndo}
                        onClick={() =>
                        editor?.chain().focus().undo().run()
                        }
                    >
                        <Image
                            src="/assets/icons/textbox/undo.svg"
                            alt=""
                            width={14}
                            height={14}
                        />
                    </ToolbarButton>

                    {/* Redo */}
                    <ToolbarButton
                        label="Redo"
                        title="Redo (Ctrl+Y)"
                        disabled={!editor || !formatting?.canRedo}
                        onClick={() =>
                        editor?.chain().focus().redo().run()
                        }
                    >
                        <Image
                            src="/assets/icons/textbox/redo.svg"
                            alt=""
                            width={14}
                            height={14}
                        />
                    </ToolbarButton>

                    {/* Attach File */}
                    <ToolbarButton
                        label="Attach file"
                        disabled={!editor}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image
                            src="/assets/icons/textbox/file.svg"
                            alt=""
                            width={10}
                            height={10}
                        />
                    </ToolbarButton>

                    {/* Add Image */}
                    <ToolbarButton
                        label="Add image"
                        disabled={!editor}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <Image
                            src="/assets/icons/textbox/add-image.svg"
                            alt=""
                            width={14}
                            height={14}
                        />
                    </ToolbarButton>

                    </div>

                    {/* Right Side */}
                    <div className="ml-3 flex shrink-0 items-center gap-2">

                    
                    {/* Clear Body */}
                    {isNotes && (
                        <button
                            type="button"
                            onClick={clearEditor}
                            aria-label="Clear body"
                            title="Clear body"
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-50"
                        >
                            <Image
                                src="/assets/icons/delete.svg"
                                alt=""
                                width={14}
                                height={14}
                            />
                        </button>
                    )}

                    {/* Comment Submit */}
                    {!isNotes && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!editor}
                            className="rounded-full border border-[#00A651] px-3 py-1 text-xs text-[#00A651] hover:bg-green-50"
                        >
                            Comment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}