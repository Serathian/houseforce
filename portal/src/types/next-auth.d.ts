import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    strapiToken?: string;
    user?: {
      id: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiToken?: string;
    strapiUserId?: number;
  }
}
