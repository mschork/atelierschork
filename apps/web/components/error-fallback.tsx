"use client"

import { useEffect } from "react"

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

export function ErrorFallback({ error, reset, title = "Something went wrong" }: ErrorFallbackProps) {
  useEffect(() => {
    // Log error to console in development
    console.error("Error:", error)
  }, [error])

  return (
    <div className="container">
      <div className="error-container">
        <h1>{title}</h1>
        <p>We couldn&apos;t load the content you requested. This might be a temporary issue.</p>
        {process.env.NODE_ENV === "development" && (
          <details className="error-details">
            <summary>Error details</summary>
            <pre>{error.message}</pre>
          </details>
        )}
        <div className="error-actions">
          <button onClick={reset} className="error-retry-button">
            Try again
          </button>
          <a href="/" className="error-home-link">
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
