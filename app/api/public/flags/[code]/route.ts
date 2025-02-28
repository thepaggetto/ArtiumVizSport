import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { code: string } }) {
  try {
    const code = params.code.toLowerCase()

    // Redirect to flagcdn.com
    return NextResponse.redirect(`https://flagcdn.com/${code}.svg`)
  } catch (error) {
    console.error(`Failed to fetch flag for code ${params.code}:`, error)
    return NextResponse.json({ error: "Failed to fetch flag" }, { status: 500 })
  }
}

