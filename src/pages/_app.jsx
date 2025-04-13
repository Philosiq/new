import "../styles/globals.css";
import { useState, useEffect } from "react";
import { BACKEND_HOSTNAME } from "../commons/development_config";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch user authentication status
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      // Always use relative URLs in browser to avoid CORS issues
      const url = '/api/auth/protected';
      
      const response = await axios.get(url, {
        withCredentials: true,
      });

      setUser(response.data.user);
      console.log("Authentication successful:", response.data.user);
    } catch (error) {
      console.error("Authentication error:", error.message || error);
      // Don't treat 404 as a critical error - user might not be logged in
      if (error.response && error.response.status !== 404) {
        setError(`Authentication failed: ${error.message}`);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionProvider session={session}>
      <Component
        {...pageProps}
        user={user}
        setUser={setUser}
        isLoading={isLoading}
        authError={error}
      />
    </SessionProvider>
  );
}

export default MyApp;
