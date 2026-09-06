import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("ATTEMPTING LOGIN WITH GOOGLE EMAIL:", user.email);
        try {
          // Send the Google access token to Strapi to verify and issue a Strapi JWT
          // Note: In Strapi Admin -> Settings -> Roles & Permissions -> Advanced, 
          // "Enable sign-ups" MUST be set to FALSE for the invitation-only flow to work.
          const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
          const res = await fetch(`${strapiUrl}/api/auth/google/callback?access_token=${account.access_token}`);
          const data = await res.json();
          
          if (!res.ok || data.error) {
            console.error("Strapi rejected the login attempt. Status:", res.status);
            console.error("Strapi Error Details:", JSON.stringify(data.error, null, 2));
          }
          
          if (data.jwt) {
            // Temporarily store the Strapi JWT and User ID on the account object
            // so it can be passed to the jwt() callback below.
            account.strapiToken = data.jwt;
            account.strapiUserId = data.user.id;
            return true;
          }
          return false; // Strapi rejected the login (e.g. user was not pre-created by admin)
        } catch (e) {
          console.error("Strapi Auth Error:", e);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, account }) {
      // If account exists, this is the initial sign-in.
      if (account?.strapiToken) {
        token.strapiToken = account.strapiToken;
        token.strapiUserId = account.strapiUserId;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the Strapi JWT to the session so the frontend can use it to fetch scoped API data
      if (session.user) {
        session.strapiToken = token.strapiToken;
        session.user.id = token.strapiUserId as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect back to login on error (e.g. AccessDenied if not pre-created)
  },
  session: {
    strategy: "jwt",
  },
};
