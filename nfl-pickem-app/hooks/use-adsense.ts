"use client"

import { useEffect, useState } from "react"

export const useAdSense = (publisherId: string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if AdSense script is already loaded
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      setIsLoaded(true)
      return
    }

    // Load AdSense script
    const script = document.createElement("script")
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
    script.async = true
    script.crossOrigin = "anonymous"

    script.onload = () => {
      setIsLoaded(true)
      console.log("AdSense script loaded successfully")
    }

    script.onerror = () => {
      setError("Failed to load AdSense script")
      console.error("Failed to load AdSense script")
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [publisherId])

  return { isLoaded, error }
}
