import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function sanitizeUrl(rawUrl?: string): string {
  const fallback = "https://goutwgptdhnuaympuxwy.supabase.co";
  if (!rawUrl) return fallback;
  let url = rawUrl.trim().replace(/^["']|["']$/g, "");
  if (url.includes("=")) {
    url = url.split("=").pop()?.trim().replace(/^["']|["']$/g, "") || fallback;
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return fallback;
  }
  return url;
}

function sanitizeKey(rawKey?: string): string {
  const fallback =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXR3Z3B0ZGhudWF5bXB1eHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDY3MTIsImV4cCI6MjEwODMyMjcxMn0.OrrQmTpSNnHHDirATYJjdljEyWh2Ypc85PB-6WCk1IU";
  if (!rawKey) return fallback;
  let key = rawKey.trim().replace(/^["']|["']$/g, "");
  if (key.includes("=")) {
    key = key.split("=").pop()?.trim().replace(/^["']|["']$/g, "") || fallback;
  }
  if (key.length < 20) {
    return fallback;
  }
  return key;
}

const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
  try {
    cookieStore = await cookies();
  } catch {
    // cookies() might not be available in static rendering contexts
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore ? cookieStore.getAll() : [];
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet) {
        if (!cookieStore) return;
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore?.set(name, value, options)
          );
        } catch {
          // Ignore if called from Server Component
        }
      },
    },
  });
}
