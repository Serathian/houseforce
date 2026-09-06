export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes EXCEPT the login page, NextAuth API routes, and static Next.js files
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
