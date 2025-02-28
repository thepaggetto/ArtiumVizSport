import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags")
    const data = await response.json()

    const countries = data.map((country: any) => ({
      code: country.cca2.toLowerCase(),
      name: country.name.common,
      flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`,
    }))

    // Sort countries by name
    return NextResponse.json(countries.sort((a: any, b: any) => a.name.localeCompare(b.name)))
  } catch (error) {
    console.error("Failed to fetch countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}

