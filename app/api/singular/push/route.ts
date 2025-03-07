import { NextResponse } from "next/server"
import { singularService } from "@/lib/singular-service"

// POST: Invia manualmente i dati a Singular.Live
export async function POST(request: Request) {
    try {
        console.log("Starting push to Singular.Live")

        // Prepara i dati degli incontri
        const matchesData = await singularService.prepareMatchesData()

        if ("error" in matchesData) {
            console.error("Error preparing data:", matchesData.error)
            return NextResponse.json(
                {
                    success: false,
                    message: matchesData.error,
                },
                {
                    status: 400,
                },
            )
        }

        console.log("Data prepared successfully")

        // Invia i dati a Singular.Live
        const result = await singularService.pushDataToSingular(matchesData)

        console.log("Push result:", result)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message,
                },
                {
                    status: 500,
                },
            )
        }
    } catch (error) {
        console.error("Errore nell'invio dei dati a Singular.Live:", error)
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Errore sconosciuto",
            },
            {
                status: 500,
            },
        )
    }
}

