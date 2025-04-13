import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";

/**
 * Debug endpoint to check authentication status and database connection
 * Access this at /api/auth/debug to see the status of your authentication system
 * IMPORTANT: Remove or protect this endpoint before going to production
 */
export default async function handler(req, res) {
  // Only allow in development or with special header
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-debug-token"] !== process.env.DEBUG_TOKEN
  ) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  const debug = {
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasMongoUri: !!process.env.MONGODB_URI,
    cookieHeader: req.headers.cookie ? "Present" : "Missing",
    headers: {
      host: req.headers.host,
      userAgent: req.headers["user-agent"],
    },
  };

  // Check session
  try {
    const session = await getServerSession(req, res, authOptions);
    debug.session = session
      ? {
          user: {
            email: session.user.email,
            role: session.user.role,
          },
          expires: session.expires,
        }
      : "No active session";
  } catch (error) {
    debug.sessionError = {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }

  // Check database
  try {
    const db = await connectToDatabase();
    debug.database = {
      connected: !!db,
      collections: Object.keys(db.connection.collections).length,
    };
  } catch (error) {
    debug.databaseError = {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }

  res.status(200).json({ success: true, debug });
}
