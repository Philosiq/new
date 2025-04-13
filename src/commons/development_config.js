// Configuration for development and production environments
// In production, use the same origin for API requests to avoid CORS issues
const getBaseUrl = () => {
  // Browser environment
  if (typeof window !== "undefined") {
    // Use relative URLs in the browser to avoid CORS
    return "";
  }

  // Server-side environment
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // In production, API routes are part of the same deployment
  return "";
};

export const BACKEND_HOSTNAME = getBaseUrl();
