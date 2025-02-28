import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const matches = await db.match.findMany({
      select: {
        nomePL1: true,
        nomePL2: true,
      },
    })

    // Extract all player names and remove duplicates
    const playerNames = new Set<string>()

    matches.forEach((match) => {
      playerNames.add(match.nomePL1)
      playerNames.add(match.nomePL2)
    })

    // Format the players as requested
    const players = Array.from(playerNames).map((name) => ({
      id: name,
      title: name,
    }))

    // Sort players alphabetically
    players.sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json(players)
  } catch (error) {
    console.error("Failed to fetch players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

