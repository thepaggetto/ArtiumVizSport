import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth-server"
import { db } from "@/lib/db"

// This endpoint is for seeding the initial admin user
// It should be disabled in production
export async function POST() {
  try {
    // Check if any users exist
    const userCount = await db.user.count()

    // Only allow seeding if no users exist
    if (userCount > 0) {
      return NextResponse.json({ error: "Database already has users. Seeding is not allowed." }, { status: 400 })
    }

    // Create admin user
    const adminUser = await createUser("admin@example.com", "admin123", "Admin", true)

    if (!adminUser) {
      return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      user: adminUser,
    })
  } catch (error) {
    console.error("Error seeding admin user:", error)
    return NextResponse.json({ error: "Failed to seed admin user" }, { status: 500 })
  }
}

