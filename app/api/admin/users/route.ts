import { NextResponse } from "next/server"
import { getCurrentUser, createUser } from "@/lib/auth-server"
import { db } from "@/lib/db"

// Create a new user (admin only)
export async function POST(request: Request) {
  try {
    // Check if the current user is an admin
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newUser = await createUser(data.email, data.password, data.name, data.isAdmin || false)

    if (!newUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// Get all users (admin only)
export async function GET() {
  try {
    // Check if the current user is an admin
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

