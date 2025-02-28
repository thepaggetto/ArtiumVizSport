"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Client-side authentication functions
export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    console.error("Errore di accesso:", error)
    return false
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    console.error("Errore di logout:", error)
    return false
  }
}

export function useAuth() {
  const router = useRouter()

  // Modifica la funzione login per garantire il reindirizzamento corretto
  const login = async (email: string, password: string) => {
    const success = await loginUser(email, password)

    if (success) {
      toast.success("Accesso effettuato con successo")
      // Aggiungiamo un breve ritardo per assicurarci che lo stato di autenticazione sia aggiornato
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 100)
      return true
    } else {
      toast.error("Email o password non validi")
      return false
    }
  }

  const logout = async () => {
    const success = await logoutUser()

    if (success) {
      toast.success("Logout effettuato con successo")
      router.push("/login")
      router.refresh()
      return true
    } else {
      toast.error("Impossibile effettuare il logout")
      return false
    }
  }

  return { login, logout }
}

export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/user")

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error("Errore durante il recupero dell'utente corrente:", error)
    return null
  }
}

