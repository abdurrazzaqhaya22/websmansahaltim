import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
