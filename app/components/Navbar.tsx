"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        // At top of page — always show
        setNavHidden(false);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down — hide
        setNavHidden(true);
      } else {
        // Scrolling up — show
        setNavHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${navHidden ? "nav-hidden" : ""}`}>
      <div className="nav-logo">
        N<span>y</span>oraa
      </div>
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about-us" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
        </li>
        <li>
          <Link href="/contacts-us" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </Link>
        </li>
      </ul>
      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
