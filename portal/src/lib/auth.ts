import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const isDevAuthEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    ...(isDevAuthEnabled
      ? [
          CredentialsProvider({
            id: "credentials",
            name: "Dev Credentials",
            credentials: {
              identifier: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (!credentials?.identifier || !credentials?.password) {
                return null;
              }
              try {
                const strapiUrl =
                  process.env.STRAPI_INTERNAL_URL ||
                  process.env.NEXT_PUBLIC_STRAPI_URL ||
                  "http://localhost:1337";

                const res = await fetch(`${strapiUrl}/api/auth/local`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    identifier: credentials.identifier,
                    password: credentials.password,
                  }),
                });

                const data = await res.json();
                if (!res.ok || !data.jwt) {
                  console.error("[Auth] Dev login failed:", data?.error || res.statusText);
                  return null;
                }

                return {
                  id: String(data.user.id),
                  email: data.user.email,
                  name: data.user.username || data.user.email,
                  strapiToken: data.jwt as string,
                  strapiUserId: data.user.id as number,
                };
              } catch (err) {
                console.error("[Auth] Local Auth Error:", err);
                return null;
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return !!user;
      }
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
            if (account) {
              account.strapiToken = data.jwt;
              account.strapiUserId = data.user.id;
            }
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
    async jwt({ token, user, account }) {
      // If user exists (from credentials provider)
      if (user?.strapiToken) {
        token.strapiToken = user.strapiToken;
        token.strapiUserId = user.strapiUserId;
      }
      // If account exists (from OAuth provider)
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
