import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { compare, hash } from "bcrypt"

// Server-side authentication functions
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return false
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return false
    }

    // Set session cookie
    const sessionId = crypto.randomUUID()
    const twoWeeks = 14 * 24 * 60 * 60 * 1000

    await db.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expires: new Date(Date.now() + twoWeeks),
      },
    })

    cookies().set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: twoWeeks,
    })

    return true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

export async function logout(): Promise<void> {
  const sessionId = cookies().get("session_id")?.value

  if (sessionId) {
    try {
      await db.session.delete({
        where: { id: sessionId },
      })
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  cookies().delete("session_id")
}

export async function getCurrentUser() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId) {
    return null
  }

  try {
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session || session.expires < new Date()) {
      if (session) {
        await db.session.delete({
          where: { id: sessionId },
        })
      }
      cookies().delete("session_id")
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

export async function createUser(email: string, password: string, name: string, isAdmin = false): Promise<any> {
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return null
    }

    const hashedPassword = await hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("User creation error:", error)
    return null
  }
}

