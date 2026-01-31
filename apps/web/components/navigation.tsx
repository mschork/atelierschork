"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import "./navigation.css"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

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
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="menu-icon" />
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
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
