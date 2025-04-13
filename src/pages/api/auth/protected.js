import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

/**
 * Protected route to check if user is authenticated
 * This route returns the user object if authenticated, otherwise a 401 error
 */
export default async function handler(req, res) {
  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Get user session
    const session = await getServerSession(req, res, authOptions);

    // Return appropriate response based on authentication status
    if (session) {
      return res.status(200).json({
        success: true,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          image: session.user.image,
        },
      });
    } else {
      // User is not authenticated
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Protected route error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
