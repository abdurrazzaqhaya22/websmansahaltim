import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://goutwgptdhnuaympuxwy.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXR3Z3B0ZGhudWF5bXB1eHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDY3MTIsImV4cCI6MjEwODMyMjcxMn0.OrrQmTpSNnHHDirATYJjdljEyWh2Ypc85PB-6WCk1IU";

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
