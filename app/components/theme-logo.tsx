"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeLogo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use favicon image instead of firecrawl logo
  const faviconSrc = "/favicon-32x32.png"

  if (!mounted) {
    // Return favicon by default to avoid hydration mismatch
    return (
      <img
        src={faviconSrc}
        alt="Firecrawl"
        className="h-8 w-auto"
      />
    )
  }

  // Always use favicon regardless of theme
  return (
    <img
      src={faviconSrc}
      alt="Firecrawl"
      className="h-8 w-auto"
    />
  )
}
