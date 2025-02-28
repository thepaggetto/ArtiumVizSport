import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-server"

export async function GET() {
  try {
    const eventDays = await db.eventDay.findMany({
      include: {
        matches: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(eventDays)
  } catch (error) {
    console.error("Failed to fetch event days:", error)
    return NextResponse.json({ error: "Failed to fetch event days" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const eventDay = await db.eventDay.create({
      data: {
        date: new Date(data.date),
        location: data.location,
        broadcaster: data.broadcaster,
      },
      include: {
        matches: true,
      },
    })

    return NextResponse.json(eventDay)
  } catch (error) {
    console.error("Failed to create event day:", error)
    return NextResponse.json({ error: "Failed to create event day" }, { status: 500 })
  }
}

