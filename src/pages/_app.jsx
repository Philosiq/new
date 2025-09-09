import "../styles/globals.css";
import { useState, useEffect } from "react";
import { BACKEND_HOSTNAME } from "../commons/development_config";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  // Add router change event listener to force page refresh for certain routes
  useEffect(() => {
    const handleRouteChange = (url) => {
      // List of routes that need a full page refresh
      const refreshRoutes = ["/mindmap", "/archetypes", "/quiz", "/contact-us"];

      // Check if the new URL matches any of the refresh routes
      const needsRefresh = refreshRoutes.some(
        (route) => url.startsWith(route) && url !== router.asPath
      );

      // If coming from results page and going to a route that needs refresh
      if (router.pathname === "/results" && needsRefresh) {
        // Use setTimeout to allow the router to complete its initial work
        setTimeout(() => {
          window.location.href = url;
        }, 100);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Fetch user authentication status
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_HOSTNAME}/api/auth/protected`,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <SessionProvider session={session}>
      {/* Google AdSense Script */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9441277012043156"
      />
      <Component {...pageProps} user={user} setUser={setUser} />
      <Analytics />
    </SessionProvider>
  );
}

export default MyApp;
