import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getCurrentUser } from "@/lib/auth-server"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const player = formData.get("player") as string
    const matchName = formData.get("matchName") as string

    if (!file || !player || !matchName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a URL-friendly version of the match name and player
    const safeMatchName = matchName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    const safePlayerName =
      player === "PL1"
        ? (formData.get("playerName") as string) || "player1"
        : (formData.get("playerName") as string) || "player2"

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // Create a unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${safeMatchName}-${safePlayerName}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write the file to the filesystem
    await writeFile(filePath, buffer)

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

