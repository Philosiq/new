import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

// Log environment info (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("NextAuth Configuration:");
  console.log("- NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "Not set");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- Has NEXTAUTH_SECRET:", !!process.env.NEXTAUTH_SECRET);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          await connectToDatabase();

          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          // Check if user exists and password is correct
          if (!user) {
            throw new Error("No user found with this email address");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token if user is present
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session object
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Enable in production
      },
    },
  },
  debug: true, // Enable debug to see what's happening
};

export default NextAuth(authOptions);
