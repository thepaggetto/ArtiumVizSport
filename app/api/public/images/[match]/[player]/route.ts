import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { match: string; player: string } }) {
  try {
    const { match, player } = params

    // Find the match by name
    const matchData = await db.match.findUnique({
      where: { name: match },
    })

    if (!matchData) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Determine which player's photo to return
    let photoPath = null
    if (player.toLowerCase() === "pl1" || player.toLowerCase() === matchData.nomePL1.toLowerCase()) {
      photoPath = matchData.fotoPL1
    } else if (player.toLowerCase() === "pl2" || player.toLowerCase() === matchData.nomePL2.toLowerCase()) {
      photoPath = matchData.fotoPL2
    }

    if (!photoPath) {
      return NextResponse.json({ error: "Player photo not found" }, { status: 404 })
    }

    // Remove the leading slash if present
    if (photoPath.startsWith("/")) {
      photoPath = photoPath.substring(1)
    }

    // Read the file from the filesystem
    const filePath = join(process.cwd(), "public", photoPath)
    const fileBuffer = await readFile(filePath)

    // Determine content type based on file extension
    const fileExtension = photoPath.split(".").pop()?.toLowerCase()
    let contentType = "image/jpeg" // Default

    if (fileExtension === "png") {
      contentType = "image/png"
    } else if (fileExtension === "gif") {
      contentType = "image/gif"
    } else if (fileExtension === "webp") {
      contentType = "image/webp"
    }

    // Return the image
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 })
  }
}

