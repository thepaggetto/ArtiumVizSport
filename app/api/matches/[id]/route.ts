import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const match = await db.match.findUnique({
      where: { id: params.id },
      include: {
        eventDay: true,
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error(`Failed to fetch match with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const data = await request.json()

    // Verify the event day exists if it's being updated
    if (data.eventDayId) {
      const eventDay = await db.eventDay.findUnique({
        where: { id: data.eventDayId },
      })

      if (!eventDay) {
        return NextResponse.json({ error: "Giornata non trovata" }, { status: 404 })
      }
    }

    const match = await db.match.update({
      where: { id: params.id },
      data: {
        eventDayId: data.eventDayId,
        name: data.name,
        tipoGara: data.tipoGara,
        nomeCampionato: data.nomeCampionato || "",
        nomePL1: data.nomePL1,
        recordPL1: data.recordPL1,
        cittaPL1: data.cittaPL1,
        nazionalitaPL1: data.nazionalitaPL1,
        svgPL1: data.svgPL1 || `https://flagcdn.com/${data.nazionalitaPL1.toLowerCase()}.svg`,
        etàPL1: data.etàPL1,
        pesoPL1: data.pesoPL1,
        altezzaPL1: data.altezzaPL1,
        fotoPL1: data.fotoPL1 || "",
        nomePL2: data.nomePL2,
        recordPL2: data.recordPL2,
        cittaPL2: data.cittaPL2,
        nazionalitaPL2: data.nazionalitaPL2,
        svgPL2: data.svgPL2 || `https://flagcdn.com/${data.nazionalitaPL2.toLowerCase()}.svg`,
        etàPL2: data.etàPL2,
        pesoPL2: data.pesoPL2,
        altezzaPL2: data.altezzaPL2,
        fotoPL2: data.fotoPL2 || "",
      },
      include: {
        eventDay: true,
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error(`Failed to update match with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    await db.match.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete match with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete match" }, { status: 500 })
  }
}

