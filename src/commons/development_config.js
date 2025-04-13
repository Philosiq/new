// Configuration for development and production environments
// In production, use the deployed URL
// In development, default to localhost:5000
const getBaseUrl = () => {
  // First check for explicit backend URL
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }

  // Otherwise use the current host (for Next.js API routes)
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return "";
  }

  // Server should use localhost in development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }

  // In production, API routes are part of the same deployment
  return "";
};

export const BACKEND_HOSTNAME = getBaseUrl();
