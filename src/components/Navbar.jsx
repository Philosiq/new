import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserCircle,
  FaHistory,
} from "react-icons/fa";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Archetypes", path: "/archetypes" },
    { name: "Quiz", path: "/quiz" },
    { name: "MindMap", path: "/mindmap", useFullNavigation: true },
    { name: "Contact Us", path: "/contact-us" },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: "Quiz History", path: "/history", icon: FaHistory });
  }

  const isHomePage = router.pathname === "/";

  return (
    <>
      {/* Top Banner - only on homepage */}
      {showBanner && isHomePage && (
        <div className="bg-yellow-100 text-center text-sm text-black py-2 px-4 fixed top-0 w-full z-[60] flex justify-center items-center flex-wrap">
          <span className="mr-4">
            🚧 This website is currently in Beta 1.0! If you spot any bugs or
            have suggestions, please email or fill out the form on the Contact
            Us page!
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="text-black text-lg font-bold hover:text-red-600 ml-2"
          >
            &times;
          </button>
        </div>
      )}

      <nav
        className={`fixed w-full transition-all duration-300 z-50 ${
          scrolled ? "bg-white shadow-md py-4" : "bg-white/70 py-4"
        } ${showBanner && isHomePage ? "top-10" : "top-0"}`}
      >
        <div className="container-custom flex justify-between items-center">
          <Link href="/" className="flex items-center" shallow={false}>
            <img src="/Website header.png" alt="logo" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium transition-colors duration-300 ${
                  router.pathname === link.path
                    ? "text-primary-maroon border-b-2 border-primary-maroon"
                    : "text-neutral-dark hover:text-primary-maroon"
                }`}
                shallow={false}
                onClick={(e) => {
                  if (link.useFullNavigation) {
                    e.preventDefault();
                    window.location.href = link.path;
                  }
                }}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-primary-maroon text-white px-4 py-2 rounded-full hover:bg-primary-darkMaroon transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center bg-primary-maroon text-white px-4 py-2 rounded-full hover:bg-primary-darkMaroon transition-colors"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </button>
            )}
          </div>

          <button
            className="md:hidden text-neutral-dark focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4 px-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium py-2 transition-colors duration-300 ${
                  router.pathname === link.path
                    ? "text-primary-maroon"
                    : "text-neutral-dark hover:text-primary-maroon"
                }`}
                onClick={(e) => {
                  setIsOpen(false);
                  if (link.useFullNavigation) {
                    e.preventDefault();
                    window.location.href = link.path;
                  }
                }}
                shallow={false}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Authentication Buttons */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center text-neutral-dark hover:text-primary-maroon py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary-maroon text-white px-4 py-2 rounded-full hover:bg-primary-darkMaroon transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsOpen(false);
                }}
                className="w-full bg-primary-maroon text-white px-4 py-2 rounded-full hover:bg-primary-darkMaroon transition-colors flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
