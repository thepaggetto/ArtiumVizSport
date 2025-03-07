import { NextResponse } from "next/server"
import { configService } from "@/lib/config-service"

// GET: Recupera la configurazione di Singular.Live
export async function GET() {
    try {
        const config = await configService.getSingularConfig()
        return NextResponse.json(config)
    } catch (error) {
        console.error("Error retrieving Singular.Live config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST: Aggiorna la configurazione di Singular.Live
export async function POST(request: Request) {
    try {
        // Ottieni i dati dalla richiesta
        const body = await request.json()

        console.log("Received data:", body)

        const config = {
            publicToken: body.publicToken || "",
            privateToken: body.privateToken || "",
            streamId: body.streamId || "",
        }

        const success = await configService.saveSingularConfig(config)

        if (success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 })
        }
    } catch (error) {
        console.error("Error updating Singular.Live config:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

