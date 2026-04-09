import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "Missing NEXTAUTH_SECRET environment variable. Set it in .env.local before running the app."
  );
}

/**
 * In-memory user store for MVP/demo purposes.
 *
 * TODO: Replace with a real database adapter (e.g., Prisma + Postgres).
 * Integration point: swap inMemoryUsers with a PrismaAdapter + real DB queries.
 *
 * WARNING: Plain-text passwords are used here for demo only.
 * In production, always hash passwords with bcrypt or argon2.
 */
export const inMemoryUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
}> = [
  {
    id: "demo-user-1",
    name: "Demo User",
    email: "demo@tryverse.com",
    password: "demo1234",
    image: "https://picsum.photos/seed/demouser/80/80",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = inMemoryUsers.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
