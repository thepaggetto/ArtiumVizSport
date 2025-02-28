"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSeed = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Utente amministratore creato con successo")
        console.log("Utente amministratore creato:", data.user)
      } else {
        const error = await response.json()
        toast.error(error.error || "Impossibile creare l'utente amministratore")
      }
    } catch (error) {
      console.error("Errore durante la creazione dell'utente amministratore:", error)
      toast.error("Impossibile creare l'utente amministratore")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creazione amministratore...
        </>
      ) : (
        "Crea Utente Amministratore"
      )}
    </Button>
  )
}

