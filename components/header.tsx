"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Logo } from "@/components/logo"

interface HeaderProps {
  isAuthenticated: boolean
}

export function Header({ isAuthenticated }: HeaderProps) {
  const { logout } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      if (isAuthenticated) {
        const user = await getCurrentUser()
        setIsAdmin(user?.isAdmin || false)
      }
    }

    checkAdmin()
  }, [isAuthenticated])

  return (
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <Logo className="logo-svg text-primary" />
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
            )}
            {isAuthenticated && (
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Esci
                </Button>
            )}
          </div>
        </div>
      </header>
  )
}

