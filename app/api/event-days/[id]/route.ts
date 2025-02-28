import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventDay = await db.eventDay.findUnique({
      where: { id: params.id },
      include: {
        matches: true,
      },
    })

    if (!eventDay) {
      return NextResponse.json({ error: "Event day not found" }, { status: 404 })
    }

    return NextResponse.json(eventDay)
  } catch (error) {
    console.error(`Failed to fetch event day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch event day" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const eventDay = await db.eventDay.update({
      where: { id: params.id },
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
    console.error(`Failed to update event day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update event day" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.eventDay.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete event day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete event day" }, { status: 500 })
  }
}

