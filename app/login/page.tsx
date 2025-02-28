import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Accesso - ArtiumViz Boxe",
  description: "Accedi per gestire gli incontri di boxe",
}

export default function LoginPage() {
  return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4">
            <Logo className="h-12 w-12 text-primary" />
            <div className="space-y-2 text-center">


            </div>
          </div>
          <LoginForm />

        </div>
      </div>
  )
}

