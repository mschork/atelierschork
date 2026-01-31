import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Atelierschork",
  description: "Art collective by Markus and Francisco Schork",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="site-container">
          <Navigation />
          <main>{children}</main>
          <footer>
            <div className="container">
              <p className="copyright">© {new Date().getFullYear()} Atelierschork</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
