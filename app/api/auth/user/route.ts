import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ error: "An error occurred while getting user data" }, { status: 500 })
  }
}

