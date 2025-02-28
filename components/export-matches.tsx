"use client"

import { useState, useEffect } from "react"
import type { Match } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clipboard, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ExportMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [exportedCode, setExportedCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch("/api/matches")
        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error("Impossibile caricare gli incontri:", error)
        toast.error("Impossibile caricare gli incontri")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  useEffect(() => {
    if (selectedMatches.length > 0) {
      const filteredMatches = matches.filter((match) => selectedMatches.includes(match.id))
      const formattedData = formatMatchesForExport(filteredMatches)
      setExportedCode(formattedData)
    } else {
      setExportedCode("")
    }
  }, [selectedMatches, matches])

  function formatMatchesForExport(matches: Match[]): string {
    const matchesObject: Record<string, any> = {}

    matches.forEach((match) => {
      matchesObject[match.name] = {
        tipoGara: match.tipoGara,
        nomeCampionato: match.nomeCampionato,
        nomePL1: match.nomePL1,
        recordPL1: match.recordPL1,
        cittaPL1: match.cittaPL1,
        nazionalitaPL1: match.nazionalitaPL1,
        svgPL1: match.svgPL1,
        etàPL1: match.etàPL1,
        pesoPL1: match.pesoPL1,
        altezzaPL1: match.altezzaPL1,
        nomePL2: match.nomePL2,
        recordPL2: match.recordPL2,
        cittaPL2: match.cittaPL2,
        nazionalitaPL2: match.nazionalitaPL2,
        svgPL2: match.svgPL2,
        etàPL2: match.etàPL2,
        pesoPL2: match.pesoPL2,
        altezzaPL2: match.altezzaPL2,
      }
    })

    return `const CompetitionsLookupTable = ${JSON.stringify(matchesObject, null, 2)}`
  }

  function toggleMatchSelection(id: string) {
    setSelectedMatches((prev) => (prev.includes(id) ? prev.filter((matchId) => matchId !== id) : [...prev, id]))
  }

  function selectAllMatches() {
    if (selectedMatches.length === matches.length) {
      setSelectedMatches([])
    } else {
      setSelectedMatches(matches.map((match) => match.id))
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(exportedCode)
      setIsCopied(true)
      toast.success("Copiato negli appunti")

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Impossibile copiare:", error)
      toast.error("Impossibile copiare negli appunti")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Nessun incontro trovato</h3>
        <p className="text-muted-foreground">Crea prima alcuni incontri per esportarli.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seleziona Incontri da Esportare</h2>
        <Button variant="outline" onClick={selectAllMatches}>
          {selectedMatches.length === matches.length ? "Deseleziona Tutti" : "Seleziona Tutti"}
        </Button>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`match-${match.id}`}
                  checked={selectedMatches.includes(match.id)}
                  onCheckedChange={() => toggleMatchSelection(match.id)}
                />
                <label
                  htmlFor={`match-${match.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {match.name} - {match.tipoGara}
                </label>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {match.nomePL1} vs {match.nomePL2}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exportedCode && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Codice Esportato</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={isCopied}>
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copiato
                </>
              ) : (
                <>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copia negli Appunti
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-lg bg-secondary overflow-x-auto text-sm">
              <code>{exportedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

