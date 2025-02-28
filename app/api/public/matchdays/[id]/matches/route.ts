import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const matchDay = await db.matchDay.findUnique({
      where: { id: params.id },
      include: {
        matches: true,
      },
    })

    if (!matchDay) {
      return NextResponse.json({ error: "Match day not found" }, { status: 404 })
    }

    // Format the response
    const response = {
      date: matchDay.date,
      location: matchDay.location,
      broadcaster: matchDay.broadcaster,
      matches: matchDay.matches,
    }

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

