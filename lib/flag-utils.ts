/**
 * Utility per la generazione degli URL delle bandiere nazionali
 */

/**
 * Genera l'URL della bandiera per una nazionalità
 * @param nationality Nome della nazionalità
 * @returns URL della bandiera nel formato corretto
 */
export function getFlagUrl(nationality: string | null | undefined): string {
    if (!nationality) return ""

    // Map di nazionalità comuni ai loro codici ISO a 2 lettere
    const countryMap: Record<string, string> = {
        Italy: "it",
        Italia: "it",
        USA: "us",
        "United States": "us",
        UK: "gb",
        "United Kingdom": "gb",
        Spain: "es",
        Spagna: "es",
        France: "fr",
        Francia: "fr",
        Germany: "de",
        Germania: "de",
        Uganda: "ug",
        Russia: "ru",
        Japan: "jp",
        Giappone: "jp",
        China: "cn",
        Cina: "cn",
        Brazil: "br",
        Brasile: "br",
        Canada: "ca",
        Australia: "au",
        Mexico: "mx",
        Messico: "mx",
        Netherlands: "nl",
        Olanda: "nl",
        Sweden: "se",
        Svezia: "se",
        Norway: "no",
        Norvegia: "no",
        Denmark: "dk",
        Danimarca: "dk",
        Finland: "fi",
        Finlandia: "fi",
        Poland: "pl",
        Polonia: "pl",
        Switzerland: "ch",
        Svizzera: "ch",
        Austria: "at",
        Belgium: "be",
        Belgio: "be",
        Portugal: "pt",
        Portogallo: "pt",
        Greece: "gr",
        Grecia: "gr",
        Ireland: "ie",
        Irlanda: "ie",
        // Aggiungi altri paesi secondo necessità
    }

    // Cerca il codice del paese nella mappa
    let countryCode = countryMap[nationality]

    // Se non trovato nella mappa, prova a usare i primi 2 caratteri in minuscolo
    if (!countryCode && nationality.length >= 2) {
        countryCode = nationality.toLowerCase().substring(0, 2)
    }

    // Se ancora non abbiamo un codice valido, usa un valore predefinito
    if (!countryCode) {
        countryCode = "xx" // Codice generico o bandiera predefinita
    }

    // Restituisci l'URL della bandiera nel formato corretto
    return `https://flagcdn.com/${countryCode}.svg`
}

