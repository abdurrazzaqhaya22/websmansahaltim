"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DeleteArticleButtonProps {
  id: string;
  judul: string;
}

export function DeleteArticleButton({ id, judul }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus artikel:\n"${judul}"?`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) {
        alert("Gagal menghapus artikel: " + error.message);
      } else {
        router.refresh();
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
      title="Hapus Artikel"
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

