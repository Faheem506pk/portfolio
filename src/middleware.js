import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create an authenticated Supabase client
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Get the user from the session
  // getUser() is safer than getSession() as it validates the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /mfiadmin routes
  if (request.nextUrl.pathname.startsWith("/mfiadmin") && !request.nextUrl.pathname.startsWith("/mfiadmin/login")) {
    if (!user) {
      // If no user, redirect to login
      return NextResponse.redirect(new URL("/mfiadmin/login", request.url));
    }
  }

  // Redirect /login to /mfiadmin/login
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/mfiadmin/login", request.url));
  }

  // If at login page and user is logged in, redirect to dashboard
  if (request.nextUrl.pathname === "/mfiadmin/login") {
    if (user) {
      return NextResponse.redirect(new URL("/mfiadmin", request.url));
    }
  }

  // Redirect legacy /admin to /mfiadmin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/mfiadmin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
