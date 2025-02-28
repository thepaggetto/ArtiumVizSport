import { NextResponse } from "next/server"
import { login } from "@/lib/auth-server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password sono obbligatori" }, { status: 400 })
    }

    const success = await login(email, password)

    if (success) {
      // Aggiungiamo un header di reindirizzamento per aiutare il client
      return NextResponse.json({
        success: true,
        redirectTo: "/",
      })
    } else {
      return NextResponse.json({ error: "Email o password non validi" }, { status: 401 })
    }
  } catch (error) {
    console.error("Errore di login:", error)
    return NextResponse.json({ error: "Si è verificato un errore durante l'accesso" }, { status: 500 })
  }
}

