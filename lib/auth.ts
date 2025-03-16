import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    {
      id: "hack-club",
      name: "Hack Club",
      type: "oauth",
      authorization: {
        url: process.env.OAUTH_AUTHORIZATION_URL,
        params: { scope: "read write", redirect_uri: "https://hackclub.com" },
      },
      token: {
        url: process.env.OAUTH_TOKEN_URL,
        async request({ params }) {
          const response = await fetch(process.env.OAUTH_TOKEN_URL!, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              ...params,
              grant_type: "authorization_code",
              client_id: process.env.OAUTH_CLIENT_ID!,
              client_secret: process.env.OAUTH_CLIENT_SECRET!,
              redirect_uri: "https://hackclub.com",
            }),
          });
          const tokens = await response.json();
          return tokens;
        },
      },
      userinfo: {
        url: process.env.OAUTH_USERINFO_URL,
        async request({ tokens }) {
          const response = await fetch(process.env.OAUTH_USERINFO_URL!, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });
          return await response.json();
        },
      },
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.username,
          email: profile.email,
          image: profile.avatar,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = {
          id: account.userId,
          name: profile.name || profile.username,
          email: profile.email,
          image: profile.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      return session;
    },
  },
};
