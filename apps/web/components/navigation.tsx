"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import "./navigation.css"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

  // Focus first menu item when menu opens
  useEffect(() => {
    if (mobileMenuOpen && mobileNavRef.current) {
      const firstLink = mobileNavRef.current.querySelector("a")
      firstLink?.focus()
    }
  }, [mobileMenuOpen])

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const navItems = [
    { name: "Projects", href: "/projects" },
    { name: "People", href: "/people" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-inner">
          <Link href="/" className="site-logo">
            Atelierschork
          </Link>

          {/* Desktop navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={pathname === item.href ? "active" : ""}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            ref={mobileNavRef}
            aria-label="Mobile navigation"
          >
            <div className="mobile-nav-inner">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
