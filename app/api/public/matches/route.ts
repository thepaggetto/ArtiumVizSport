import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const matches = await db.match.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    // Return the matches as JSON
    return NextResponse.json(matches)
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

