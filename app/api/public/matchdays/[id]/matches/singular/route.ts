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

    // Format matches for Singular.Live
    const matchesObject: Record<string, any> = {}

    matchDay.matches.forEach((match) => {
      matchesObject[match.name] = {
        tipoGara: match.tipoGara,
        nomeCampionato: match.nomeCampionato,
        nomePL1: match.nomePL1,
        recordPL1: match.recordPL1,
        cittaPL1: match.cittaPL1,
        nazionalitaPL1: match.nazionalitaPL1,
        svgPL1: match.svgPL1,
        etàPL1: match.etàPL1,
        pesoPL1: match.pesoPL1,
        altezzaPL1: match.altezzaPL1,
        nomePL2: match.nomePL2,
        recordPL2: match.recordPL2,
        cittaPL2: match.cittaPL2,
        nazionalitaPL2: match.nazionalitaPL2,
        svgPL2: match.svgPL2,
        etàPL2: match.etàPL2,
        pesoPL2: match.pesoPL2,
        altezzaPL2: match.altezzaPL2,
      }
    })

    // Return the formatted data with event details
    const response = `const CompetitionsLookupTable = ${JSON.stringify(
      {
        eventDetails: {
          date: matchDay.date,
          location: matchDay.location,
          broadcaster: matchDay.broadcaster,
        },
        matches: matchesObject,
      },
      null,
      2,
    )}`

    return new NextResponse(response, {
      headers: {
        "Content-Type": "application/javascript",
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

