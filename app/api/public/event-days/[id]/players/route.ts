import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // First try to find by ID
    let eventDay = await db.eventDay.findUnique({
      where: { id: params.id },
      include: {
        matches: {
          select: {
            nomePL1: true,
            nomePL2: true,
          },
        },
      },
    })

    // If not found by ID, try to find by slug (broadcaster-date)
    if (!eventDay) {
      const [broadcaster, dateStr] = params.id.split("-")
      if (broadcaster && dateStr) {
        const date = new Date(dateStr)
        eventDay = await db.eventDay.findFirst({
          where: {
            AND: [
              { broadcaster: broadcaster.toUpperCase() },
              {
                date: {
                  gte: date,
                  lt: new Date(new Date(date).setDate(date.getDate() + 1)),
                },
              },
            ],
          },
          include: {
            matches: {
              select: {
                nomePL1: true,
                nomePL2: true,
              },
            },
          },
        })
      }
    }

    if (!eventDay) {
      return NextResponse.json({ error: "Event day not found" }, { status: 404 })
    }

    // Extract all player names and remove duplicates
    const playerNames = new Set<string>()

    eventDay.matches.forEach((match) => {
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

    return NextResponse.json(players, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Failed to fetch players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

