import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-server"

export async function GET() {
  try {
    const matchDays = await db.matchDay.findMany({
      include: {
        matches: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(matchDays)
  } catch (error) {
    console.error("Failed to fetch match days:", error)
    return NextResponse.json({ error: "Failed to fetch match days" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verifica autenticazione
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const data = await request.json()

    const matchDay = await db.matchDay.create({
      data: {
        date: new Date(data.date),
        location: data.location,
        broadcaster: data.broadcaster,
      },
    })

    return NextResponse.json(matchDay)
  } catch (error) {
    console.error("Failed to create match day:", error)
    return NextResponse.json({ error: "Failed to create match day" }, { status: 500 })
  }
}

