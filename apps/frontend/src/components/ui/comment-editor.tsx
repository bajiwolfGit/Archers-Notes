"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import {
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";

export interface CommentAttachment {
  id: string;
  file: File;
}

interface CommentEditorProps {
  onSubmit: (
    html: string,
    attachments: CommentAttachment[]
  ) => void;
}

export default function CommentEditor({
  onSubmit,
}: CommentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachments, setAttachments] = useState<
    CommentAttachment[]
  >([]);

  const editor = useEditor({
    extensions: [
      StarterKit,

      Placeholder.configure({
        placeholder: "Join the conversation",
      }),

      TiptapImage.configure({
        inline: false,
        allowBase64: true,
      }),
    ],

    content: "",
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[35px] w-full outline-none text-xs leading-relaxed",
        "aria-label": "Write a comment",
      },
    },
  });

  const formatting = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
    }),
  });

  // Add selected images inside the editor
  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (!editor) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor
            .chain()
            .focus()
            .setImage({
              src: reader.result,
              alt: file.name,
            })
            .run();
        }
      };

      reader.readAsDataURL(file);
    }

    event.target.value = "";
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

    setAttachments((previous) => [
      ...previous,
      ...newAttachments,
    ]);

    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((previous) =>
      previous.filter((attachment) => attachment.id !== id)
    );
  }

  function handleComment() {
    if (!editor) return;

    if (editor.isEmpty && attachments.length === 0) return;

    onSubmit(editor.getHTML(), attachments);

    editor.commands.clearContent();
    setAttachments([]);
  }

  function handleCancel() {
    editor?.commands.clearContent();
    setAttachments([]);
  }

  return (
    <div className="mt-6 rounded-md border border-gray-400 bg-white p-3">

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

      {/* Rich Text Editor */}
      <EditorContent editor={editor} />

      {/* Selected File Attachments */}
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
                  {(
                    attachment.file.size /
                    1024
                  ).toFixed(1)}{" "}
                  KB
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
      <div className="mt-2 flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* Bold */}
          <button
            type="button"
            aria-label="Bold"
            title="Bold (Ctrl+B)"
            aria-pressed={formatting?.bold ?? false}
            disabled={!editor}
            onClick={() =>
              editor?.chain().focus().toggleBold().run()
            }
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
              formatting?.bold
                ? "bg-green-100 ring-1 ring-[#00A651]"
                : "hover:bg-gray-100"
            }`}
          >
            <Image
              src="/assets/icons/textbox/bold.svg"
              alt=""
              width={10}
              height={10}
            />
          </button>

          {/* Italic */}
          <button
            type="button"
            aria-label="Italic"
            title="Italic (Ctrl+I)"
            aria-pressed={formatting?.italic ?? false}
            disabled={!editor}
            onClick={() =>
              editor?.chain().focus().toggleItalic().run()
            }
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
              formatting?.italic
                ? "bg-green-100 ring-1 ring-[#00A651]"
                : "hover:bg-gray-100"
            }`}
          >
            <Image
              src="/assets/icons/textbox/italics.svg"
              alt=""
              width={10}
              height={10}
            />
          </button>

          {/* Attach File */}
          <button
            type="button"
            aria-label="Attach file"
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-5 w-5 items-center justify-center"
          >
            <Image
              src="/assets/icons/textbox/file.svg"
              alt=""
              width={10}
              height={10}
            />
          </button>

          {/* Add Image */}
          <button
            type="button"
            aria-label="Add image"
            title="Add image"
            onClick={() => imageInputRef.current?.click()}
            className="flex h-5 w-5 items-center justify-center"
          >
            <Image
              src="/assets/icons/textbox/add-image.svg"
              alt=""
              width={14}
              height={14}
            />
          </button>

        </div>

        {/* Comment Buttons */}
        <div className="flex items-center gap-2">

          {/* Submit */}
          <button
            type="button"
            onClick={handleComment}
            disabled={!editor}
            className="rounded-full border border-[#00A651] px-3 py-1 text-xs text-[#00A651] hover:bg-green-50"
          >
            Comment
          </button>

        </div>
      </div>
    </div>
  );
}