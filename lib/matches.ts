import type { Match } from "@/lib/types"
import { db } from "@/lib/db"

// Get all matches
export async function getMatches(): Promise<Match[]> {
  try {
    const matches = await db.match.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return matches
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return []
  }
}

// Get a single match by ID
export async function getMatch(id: string): Promise<Match | null> {
  try {
    const match = await db.match.findUnique({
      where: { id },
    })

    return match
  } catch (error) {
    console.error(`Failed to fetch match with ID ${id}:`, error)
    return null
  }
}

// Create a new match
export async function createMatch(data: Omit<Match, "id">): Promise<Match> {
  try {
    const match = await db.match.create({
      data,
    })

    return match
  } catch (error) {
    console.error("Failed to create match:", error)
    throw new Error("Failed to create match")
  }
}

// Update an existing match
export async function updateMatch(id: string, data: Partial<Match>): Promise<Match> {
  try {
    const match = await db.match.update({
      where: { id },
      data,
    })

    return match
  } catch (error) {
    console.error(`Failed to update match with ID ${id}:`, error)
    throw new Error("Failed to update match")
  }
}

// Delete a match
export async function deleteMatch(id: string): Promise<boolean> {
  try {
    await db.match.delete({
      where: { id },
    })

    return true
  } catch (error) {
    console.error(`Failed to delete match with ID ${id}:`, error)
    return false
  }
}

// Format match data for export to Singular.Live
export function formatMatchForExport(matches: Match[]): string {
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

