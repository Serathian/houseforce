import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    strapiToken?: string;
    user?: {
      id: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    strapiToken?: string;
    strapiUserId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiToken?: string;
    strapiUserId?: number;
  }
}
