import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://goutwgptdhnuaympuxwy.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXR3Z3B0ZGhudWF5bXB1eHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDY3MTIsImV4cCI6MjEwODMyMjcxMn0.OrrQmTpSNnHHDirATYJjdljEyWh2Ypc85PB-6WCk1IU";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
