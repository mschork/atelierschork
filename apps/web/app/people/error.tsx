"use client"

import { ErrorFallback } from "@/components/error-fallback"

export default function PeopleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback error={error} reset={reset} title="Failed to load people" />
}
