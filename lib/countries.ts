import type { Country } from "@/lib/types"

// Get all countries with their flags
export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags")
    const data = await response.json()

    const countries: Country[] = data.map((country: any) => ({
      code: country.cca2.toLowerCase(),
      name: country.name.common,
      // Update flag URL format to use 2-letter country code
      flag: country.cca2 ? `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png` : "",
    }))

    // Sort countries by name
    return countries.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error("Failed to fetch countries:", error)
    return []
  }
}

