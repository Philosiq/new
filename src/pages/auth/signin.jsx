import React, { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function SignIn({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailedError, setDetailedError] = useState(null);
  const router = useRouter();

  // Check for error from URL (e.g., when redirected from protected page)
  React.useEffect(() => {
    if (router.query.error) {
      setError("You must be signed in to access this page");
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetailedError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error("Sign in error:", result.error);
        setError(result.error);

        // Check for connection issues
        if (
          result.error.includes("network") ||
          result.error.includes("fetch")
        ) {
          setDetailedError(
            "There seems to be a network issue. Please check your internet connection."
          );
        }
      } else {
        // Redirect to admin dashboard or callback URL
        const callbackUrl = router.query.callbackUrl || "/admin";
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in");
      setDetailedError(`Technical details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get auth debug info (development only)
  const checkAuthDebug = async () => {
    if (process.env.NODE_ENV !== "development") return;

    try {
      const response = await fetch("/api/auth/debug");
      const data = await response.json();
      console.log("Auth debug info:", data);
      setDetailedError(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to get debug info:", error);
    }
  };

  return (
    <Layout title="Sign In - PhilosiQ Admin">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-darkBlue">
                Admin Sign In
              </h1>
              <p className="text-gray-600 mt-2">
                Sign in to access the admin panel
              </p>
            </div>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                role="alert"
              >
                <p>{error}</p>
                {detailedError && (
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer">
                      Technical Details
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {detailedError}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary-maroon hover:bg-primary-darkMaroon text-white font-bold py-3 px-4 rounded transition-colors duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={checkAuthDebug}
                    className="text-sm text-gray-500 hover:text-primary-maroon"
                  >
                    Check Auth Status (Dev Only)
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
