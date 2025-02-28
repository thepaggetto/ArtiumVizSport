import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-server"

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

    return NextResponse.json(matchDay)
  } catch (error) {
    console.error(`Failed to fetch match day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch match day" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const data = await request.json()

    const matchDay = await db.matchDay.update({
      where: { id: params.id },
      data: {
        date: new Date(data.date),
        location: data.location,
        broadcaster: data.broadcaster,
      },
    })

    return NextResponse.json(matchDay)
  } catch (error) {
    console.error(`Failed to update match day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update match day" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    await db.matchDay.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete match day with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete match day" }, { status: 500 })
  }
}

