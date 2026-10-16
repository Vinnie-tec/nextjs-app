import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import db from "@/lib/dbSetup";

// The new proxy.js convention always runs in the Node.js runtime so we don't specify runtime

export async function proxy(request) {
  // ✅ Get the token (if user is logged in)
  const token = await getToken({ req: request });

  // ✅ Extract the current request path (e.g., "/chat", "/debug/db") for route checks
  const { pathname } = request.nextUrl;

  // ✅ Define route groups
  const protectedPaths = ["/chat"];
  const adminPaths = ["/debug/db"];

  // ✅ Check if path is protected or admin-only
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdminRoute = adminPaths.some((path) => pathname.startsWith(path));

  // ✅ 1. Unauthenticated user trying to access protected route
  if (isProtected && !token) {
    console.log("Unauthenticated access to protected route:", pathname);

    // Create a new login URL relative to the current request
    const loginUrl = new URL("/login", request.url);

    // Append a `callbackUrl` query param so the user can be returned
    // to their original destination after successful login
    loginUrl.searchParams.set("callbackUrl", request.url);

    // Redirect the user to /login
    return NextResponse.redirect(loginUrl);
  }

    // ✅ 2. Non-admin trying to access admin-only route
  if (isAdminRoute) {
    // 🧩 If user is not logged in but tries to access an admin route,
    // redirect them to /login and include a callback to return after login
    if (!token) {
      console.log("Unauthenticated access to admin route:", pathname);

      // Create a login URL relative to the current request
      const loginUrl = new URL("/login", request.url);

      // Attach the callback URL so user can be redirected back post-login
      loginUrl.searchParams.set("callbackUrl", request.url);

      // Redirect the user to the login page
      return NextResponse.redirect(loginUrl);
    }

    // 🧩 If user is logged in but not an admin,
    // redirect them to the homepage with an error flag
    if (token.is_admin !== 1) {
      console.log("Unauthorized access — not an admin:", token?.email);

      // Create a redirect URL to the homepage
      const unauthorizedUrl = new URL("/", request.url);

      // Include an error query param for UI feedback
      unauthorizedUrl.searchParams.set("error", "unauthorized");

      // Redirect the user to the homepage
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // ✅ Otherwise continue
  return NextResponse.next();
}

// ✅ Proxy only runs for relevant routes
export const config = {
  matcher: ["/chat/:path*", "/debug/db/:path*"],
};