"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Email atau password tidak sesuai.");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setErrorMsg("Terjadi kesalahan sistem saat mencoba masuk.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#E2DFD5] rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
      {/* School Logo & Title */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative w-16 h-16 bg-white rounded-full p-1 border border-[#E2DFD5] shadow-xs overflow-hidden">
          <Image
            src="/logo.png"
            alt="Logo SMAN 1 Halmahera Timur"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-editorial text-2xl font-bold text-[#122238]">
            Portal Administrasi
          </h1>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            SMA Negeri 1 Halmahera Timur
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#122238] block">
            Email Petugas / Admin
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F5] text-xs border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white text-[#1C232E]"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#122238] block">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F5] text-xs border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white text-[#1C232E]"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 bg-[#122238] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-[#F0EEE6] text-center text-xs text-gray-500">
        <p>Akses terbatas hanya untuk administrator resmi sekolah.</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-gray-500">
            Memuat formulir masuk...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
