/**
 * @file page.tsx
 * @description Landing page for the Notetify application.
 * Redirects authenticated users (those with a valid 'auth-token' cookie) to the /notes page.
 * Displays a feature overview and login/sign-up options for guest users.
 */

import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (token) {
    redirect("/notes")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4f8]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">Docket</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Your beautiful, colorful notes app
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>

        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-amber-200 p-4 text-left text-amber-900">
            <p className="font-medium">Quick notes</p>
            <p className="mt-1 text-sm opacity-75">Capture your thoughts</p>
          </div>
          <div className="rounded-xl bg-orange-400 p-4 text-left text-orange-950">
            <p className="font-medium">Color coded</p>
            <p className="mt-1 text-sm opacity-75">Stay organized</p>
          </div>
          <div className="rounded-xl bg-purple-300 p-4 text-left text-purple-900">
            <p className="font-medium">Pin important</p>
            <p className="mt-1 text-sm opacity-75">Keep it visible</p>
          </div>
          <div className="rounded-xl bg-lime-300 p-4 text-left text-lime-900">
            <p className="font-medium">Archive</p>
            <p className="mt-1 text-sm opacity-75">Clean & tidy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
