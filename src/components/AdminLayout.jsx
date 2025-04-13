import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  FaHome,
  FaQuestion,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaList,
  FaGlobe,
  FaEnvelope,
  FaCog,
} from "react-icons/fa";

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const isActive = (path) => {
    return router.pathname === path
      ? "bg-primary-maroon text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to login");
      router.push(
        "/auth/signin?callbackUrl=" + encodeURIComponent(router.asPath)
      );
    }
  }, [status, router]);

  // Handle sign out with a hard refresh to ensure cookies are cleared
  const handleSignOut = async () => {
    // Sign out using NextAuth
    await signOut({ redirect: false });

    // Then refresh the page to ensure all cookies are properly cleared
    window.location.href = "/auth/signin";
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show empty div if not authenticated (will redirect)
  if (status !== "authenticated") {
    return <div></div>;
  }

  // Main layout with sidebar
  return (
    <div className="min-h-screen bg-neutral-light flex flex-col">
      {/* Mobile header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 md:hidden">
        <div className="px-4 py-2 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="flex items-center">
            <img src="/whiteQ.png" alt="Logo" className="h-10 mr-2" />
            <span className="font-bold text-xl text-primary-maroon">Admin</span>
          </div>
          <div>{/* User menu could go here */}</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - desktop is permanent, mobile is toggleable */}
        <aside
          className={`bg-white shadow-md w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-20 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <img src="/whiteQ.png" alt="Logo" className="h-10 mr-2" />
              <span className="font-bold text-xl text-primary-maroon">
                PhilosiQ Admin
              </span>
            </div>

            {/* Sidebar menu */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <Link
                href="/admin"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/admin"
                )}`}
              >
                <FaHome className="mr-3 text-xl" />
                Dashboard
              </Link>

              <Link
                href="/admin/questions"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/admin/questions"
                )}`}
              >
                <FaQuestion className="mr-3 text-xl" />
                Questions
              </Link>

              <Link
                href="/admin/stats"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/admin/stats"
                )}`}
              >
                <FaChartBar className="mr-3 text-xl" />
                Statistics
              </Link>

              <Link
                href="/admin/users"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/admin/users"
                )}`}
              >
                <FaUser className="mr-3 text-xl" />
                Users
              </Link>

              <Link
                href="/admin/settings"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/admin/settings"
                )}`}
              >
                <FaCog className="mr-3 text-xl" />
                Settings
              </Link>
            </nav>

            {/* Sidebar footer */}
            <div className="px-3 py-4 border-t border-gray-200">
              <div className="flex items-center px-3 py-3 mb-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-primary-maroon flex items-center justify-center text-white mr-2">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="font-medium">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email || "admin@example.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-3 text-xl" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          {/* Page title */}
          {title && (
            <h1 className="text-2xl font-bold text-secondary-darkBlue mb-6">
              {title}
            </h1>
          )}

          {/* Page content */}
          {children}
        </main>
      </div>
    </div>
  );
}
