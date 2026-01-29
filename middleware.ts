import { auth } from "@/lib/auth";

export default auth((req) => {
  const isGameRoute = req.nextUrl.pathname.startsWith("/new") ||
    req.nextUrl.pathname.startsWith("/join") ||
    req.nextUrl.pathname.startsWith("/room");
  if (isGameRoute && !req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(login);
  }
  return undefined;
});

export const config = {
  matcher: ["/new", "/join", "/room/:path*"],
};
