import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { getCurrentUser } from "@/lib/auth"

// Get a single user (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(`Failed to fetch user with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// Update a user (admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Prepare update data
    const updateData: any = {}

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.isAdmin !== undefined) updateData.isAdmin = data.isAdmin

    // If password is provided, hash it
    if (data.password) {
      updateData.password = await hash(data.password, 10)
    }

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(`Failed to update user with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// Delete a user (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent deleting yourself
    if (currentUser.id === params.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
    }

    await db.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to delete user with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

