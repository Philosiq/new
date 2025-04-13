import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

/**
 * Session endpoint to get current session data
 * This helps ensure the session cookie is properly set
 */
export default async function handler(req, res) {
  try {
    // Set CORS headers to allow requests from any origin
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Get user session
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      return res.status(200).json({
        success: true,
        authenticated: true,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        authenticated: false,
      });
    }
  } catch (error) {
    console.error("Session endpoint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
