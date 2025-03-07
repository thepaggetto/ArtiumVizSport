import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        // Ottieni il token privato dalla richiesta
        const body = await request.json()
        const { privateToken } = body

        if (!privateToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Token privato mancante",
                },
                {
                    status: 400,
                },
            )
        }

        // Endpoint API di Singular.Live per verificare la connessione
        const endpoint = `https://datastream.singular.live/datastreams/${privateToken}`

        console.log("Testing connection to Singular.Live:", endpoint)

        // Invia una richiesta GET per verificare se il token è valido
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        console.log("Connection test response status:", response.status)

        if (response.ok) {
            return NextResponse.json({
                success: true,
                message: "Connessione a Singular.Live riuscita",
            })
        } else {
            const errorText = await response.text()
            console.error("Connection test error:", errorText)

            return NextResponse.json(
                {
                    success: false,
                    message: `Errore di connessione: ${response.status} ${errorText}`,
                },
                {
                    status: 400,
                },
            )
        }
    } catch (error) {
        console.error("Error testing connection to Singular.Live:", error)
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

