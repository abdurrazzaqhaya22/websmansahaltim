"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL tautan:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-[#D5D2C8] rounded-lg overflow-hidden bg-white shadow-2xs focus-within:border-[#122238] transition-colors">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FAF9F5] border-b border-[#E2DFD5] text-[#122238]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("bold") ? "bg-[#EAE8E0] font-bold text-[#B45309]" : ""
          }`}
          title="Tebal (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("italic") ? "bg-[#EAE8E0] text-[#B45309]" : ""
          }`}
          title="Miring (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#D5D2C8] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-[#EAE8E0] text-[#B45309] font-bold" : ""
          }`}
          title="Judul Bagian (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-[#EAE8E0] text-[#B45309] font-bold" : ""
          }`}
          title="Subjudul (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#D5D2C8] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("bulletList") ? "bg-[#EAE8E0] text-[#B45309]" : ""
          }`}
          title="Poin Daftar (Bullet List)"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("orderedList") ? "bg-[#EAE8E0] text-[#B45309]" : ""
          }`}
          title="Daftar Bernomor (Numbered List)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("blockquote") ? "bg-[#EAE8E0] text-[#B45309]" : ""
          }`}
          title="Kutipan (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-[#EAE8E0] transition-colors ${
            editor.isActive("link") ? "bg-[#EAE8E0] text-[#B45309]" : ""
          }`}
          title="Sisipkan Tautan (Link)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#D5D2C8] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-[#EAE8E0] disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-[#EAE8E0] disabled:opacity-40"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[220px] text-sm text-[#1C232E] focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

