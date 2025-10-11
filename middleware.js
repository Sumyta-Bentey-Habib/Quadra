import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = req.nextUrl;

	// Allow requests for next-auth session & provider fetching
	if (pathname.startsWith("/api/auth")) {
		return NextResponse.next();
	}

	// Redirect to login if no token and trying to access a protected route
	if (!token && pathname !== "/login" && pathname !== "/register") {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// If token exists, redirect from login/register to home
	if (token && (pathname === "/login" || pathname === "/register")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|/messages/).*)",
	],
};
