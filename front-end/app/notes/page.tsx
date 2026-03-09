/**
 * @file notes/page.tsx
 * @description Main dashboard page for authenticated users.
 * Fetches the user's notes from the Spring Boot API on the server
 * and renders them using the NotesContainer.
 */

import { redirect } from "next/navigation"
import { serverApi } from "@/lib/api-server"
import { NotesContainer } from "@/components/notes/notes-container"
import { cookies } from "next/headers"

export default async function NotesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  let notes = []
  try {
    notes = await serverApi.get<any[]>("/notes")
  } catch (error) {
    console.error("Failed to fetch notes", error)
    // Handle error or redirect
  }

  return <NotesContainer initialNotes={notes || []} />
}
