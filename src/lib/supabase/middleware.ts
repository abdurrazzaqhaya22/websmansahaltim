import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const defaultSupabaseUrl = "https://goutwgptdhnuaympuxwy.supabase.co";
const defaultSupabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXR3Z3B0ZGhudWF5bXB1eHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDY3MTIsImV4cCI6MjEwODMyMjcxMn0.OrrQmTpSNnHHDirATYJjdljEyWh2Ypc85PB-6WCk1IU";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultSupabaseKey;

  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin routes (except /admin/login)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
      }
    }

    // If already logged in, redirect away from /admin/login to /admin
    if (pathname === "/admin/login" && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware session error:", error);
    // Never crash public pages if session retrieval fails
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}
