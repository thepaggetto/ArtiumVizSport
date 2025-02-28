"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthCheckProps {
  isAuthenticated: boolean
  children: React.ReactNode
}

export function AuthCheck({ isAuthenticated: initialIsAuthenticated, children }: AuthCheckProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated)

  useEffect(() => {
    // Update authentication state from props
    setIsAuthenticated(initialIsAuthenticated)
    setIsChecking(false)
  }, [initialIsAuthenticated])

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/setup"]

    if (!isChecking && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/login")
    } else if (!isChecking && isAuthenticated && pathname === "/login") {
      // Redirect to dashboard if already authenticated and trying to access login page
      router.push("/")
    }
  }, [isAuthenticated, pathname, router, isChecking])

  // Show nothing while checking authentication
  if (isChecking) {
    return null
  }

  return <>{children}</>
}

