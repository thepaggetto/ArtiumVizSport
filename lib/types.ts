export interface Match {
  id: string
  name: string
  tipoGara: string
  nomeCampionato: string
  nomePL1: string
  recordPL1: string
  cittaPL1: string
  nazionalitaPL1: string
  svgPL1: string
  etàPL1: string
  pesoPL1: string
  altezzaPL1: string
  nomePL2: string
  recordPL2: string
  cittaPL2: string
  nazionalitaPL2: string
  svgPL2: string
  etàPL2: string
  pesoPL2: string
  altezzaPL2: string
  eventDayId: string
  recordWPL1: number
  recordLPL1: number
  recordDPL1: number
  recordWPL2: number
  recordLPL2: number
  recordDPL2: number
}

export interface EventDay {
  id: string
  date: Date
  location: string
  broadcaster: string
  matches: Match[]
}

export interface Country {
  code: string
  name: string
  flag: string
}

