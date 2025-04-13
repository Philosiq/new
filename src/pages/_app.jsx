import "../styles/globals.css";
import { useState, useEffect } from "react";
import { BACKEND_HOSTNAME } from "../commons/development_config";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch user authentication status
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      // Build the URL properly - use relative path if BACKEND_HOSTNAME is empty
      const url = BACKEND_HOSTNAME
        ? `${BACKEND_HOSTNAME}/api/auth/protected`
        : "/api/auth/protected";

      const response = await axios.get(url, {
        withCredentials: true,
      });

      setUser(response.data.user);
      console.log("Authentication successful:", response.data.user);
    } catch (error) {
      console.error("Authentication error:", error.message);
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
      />
    </SessionProvider>
  );
}

export default MyApp;
