import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { loginSchema } from "./validation/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // try {
        const validatedCredentials = loginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          throw new Error("Invalid input data");
        }

        const { email, password } = validatedCredentials.data;

        // Ensure credentials are provided
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // Find the user in the database
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with the provided credentials");
        }

        // Verify the password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return the user object upon successful validation
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified as Date | null;
        // session.user.username = token.username;
        // session.user.avatarColor = token.avatarColor;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findUnique({
        where: { email: token.email || "" },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      // if (!dbUser.username || !dbUser.avatarColor) {
      //   const updates: Record<string, any> = {};

      //   if (!dbUser.username) {
      //     updates.username = `${dbUser.email.split("@")[0]}-${nanoid(5)}`;
      //   }

      //   if (!dbUser.avatarColor) {
      //     updates.avatarColor = getRandomColor();
      //   }

      //   if (Object.keys(updates).length > 0) {
      //     await db.user.update({
      //       where: { id: dbUser.id },
      //       data: updates,
      //     });
      //   }
      // }

      return {
        id: dbUser.id,
        name: dbUser.name ?? "",
        email: dbUser.email ?? "",
        emailVerified: dbUser.emailVerified ?? null,
        // picture: dbUser.imageUrl,
        // username: dbUser.username,
        // avatarColor: dbUser.avatarColor,
      };
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && existingUser.password) {
          // 🚫 This email is already registered with credentials
          throw new Error(
            "This email is already registered with email & password. Please log in with credentials instead."
          );
          // Or: return "/login?error=UseCredentials"; // redirect with error code
        }

        return true;
      }

      if (!user.emailVerified) {
        return `${process.env.NEXT_PUBLIC_BASE_URL}/verify?email=${user.email}`;
      }

      return true;
    },
    redirect({ url }) {
      return url;
    },
  },
};

export const getCurrentUser = () => getServerSession(authOptions);
