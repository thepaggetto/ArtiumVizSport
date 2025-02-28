import type { EventDay } from "@/lib/types"
import { db } from "@/lib/db"

// Get all event days with their matches
export async function getEventDays(): Promise<EventDay[]> {
  try {
    const eventDays = await db.eventDay.findMany({
      include: {
        matches: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return eventDays
  } catch (error) {
    console.error("Failed to fetch event days:", error)
    return []
  }
}

// Get a single event day by ID
export async function getEventDay(id: string): Promise<EventDay | null> {
  try {
    const eventDay = await db.eventDay.findUnique({
      where: { id },
      include: {
        matches: true,
      },
    })

    return eventDay
  } catch (error) {
    console.error(`Failed to fetch event day with ID ${id}:`, error)
    return null
  }
}

// Create a new event day
export async function createEventDay(data: Omit<EventDay, "id" | "matches">): Promise<EventDay> {
  try {
    const eventDay = await db.eventDay.create({
      data,
      include: {
        matches: true,
      },
    })

    return eventDay
  } catch (error) {
    console.error("Failed to create event day:", error)
    throw new Error("Failed to create event day")
  }
}

// Update an existing event day
export async function updateEventDay(id: string, data: Partial<EventDay>): Promise<EventDay> {
  try {
    const eventDay = await db.eventDay.update({
      where: { id },
      data,
      include: {
        matches: true,
      },
    })

    return eventDay
  } catch (error) {
    console.error(`Failed to update event day with ID ${id}:`, error)
    throw new Error("Failed to update event day")
  }
}

// Delete an event day
export async function deleteEventDay(id: string): Promise<boolean> {
  try {
    await db.eventDay.delete({
      where: { id },
    })

    return true
  } catch (error) {
    console.error(`Failed to delete event day with ID ${id}:`, error)
    return false
  }
}

