import type { MatchDay } from "@/lib/types"
import { db } from "@/lib/db"

// Get all match days
export async function getMatchDays(): Promise<MatchDay[]> {
  try {
    const matchDays = await db.matchDay.findMany({
      include: {
        matches: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return matchDays
  } catch (error) {
    console.error("Failed to fetch match days:", error)
    return []
  }
}

// Get a single match day by ID
export async function getMatchDay(id: string): Promise<MatchDay | null> {
  try {
    const matchDay = await db.matchDay.findUnique({
      where: { id },
      include: {
        matches: true,
      },
    })

    return matchDay
  } catch (error) {
    console.error(`Failed to fetch match day with ID ${id}:`, error)
    return null
  }
}

// Create a new match day
export async function createMatchDay(
  data: Omit<MatchDay, "id" | "matches" | "createdAt" | "updatedAt">,
): Promise<MatchDay> {
  try {
    const matchDay = await db.matchDay.create({
      data: {
        date: data.date,
        location: data.location,
        broadcaster: data.broadcaster,
      },
      include: {
        matches: true,
      },
    })

    return matchDay
  } catch (error) {
    console.error("Failed to create match day:", error)
    throw new Error("Failed to create match day")
  }
}

// Update an existing match day
export async function updateMatchDay(
  id: string,
  data: Partial<Omit<MatchDay, "id" | "matches" | "createdAt" | "updatedAt">>,
): Promise<MatchDay> {
  try {
    const matchDay = await db.matchDay.update({
      where: { id },
      data,
      include: {
        matches: true,
      },
    })

    return matchDay
  } catch (error) {
    console.error(`Failed to update match day with ID ${id}:`, error)
    throw new Error("Failed to update match day")
  }
}

// Delete a match day
export async function deleteMatchDay(id: string): Promise<boolean> {
  try {
    await db.matchDay.delete({
      where: { id },
    })

    return true
  } catch (error) {
    console.error(`Failed to delete match day with ID ${id}:`, error)
    return false
  }
}

