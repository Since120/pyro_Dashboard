// apps/dashboard/src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { NextAuthOptions } from "next-auth";

// Wir definieren hier deine NextAuth-Konfiguration
// (Discord-Provider, secret usw.).
export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      // Dieselben Variablennamen,
      // die du in der .env (Root) angelegt hast:
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",

      // Wenn du später Rollen abfragen willst, kann
      // scope erweitert werden, z.B. "identify guilds email"
      authorization: {
        params: {
          scope: "identify",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      // Access-Token speichern, falls du später
      // in einer API-Route Gilden/Rollen abfragen willst
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Falls du in der UI was vom Access-Token brauchst:
      // session.user.discordAccessToken = token.accessToken;
      return session;
    },
  },
};

// Hier wird NextAuth konfiguriert und als GET & POST exportiert.
// So erkennt Next.js (App Router),
// dass diese Route via /api/auth/... ansprechbar ist.
const handler = NextAuth(authOptions);

// Der App Router braucht GET und POST Handler:
export { handler as GET, handler as POST };
