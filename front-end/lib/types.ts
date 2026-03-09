/**
 * @file types.ts
 * @description Global TypeScript interfaces and constants for the application.
 * Defines the 'Note' entity and associated color constants.
 */

export interface Note {
  id: string
  user_id: string
  title: string
  content: string | null
  color: string
  is_archived: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export type NoteColor =
  | "yellow"
  | "orange"
  | "coral"
  | "pink"
  | "purple"
  | "blue"
  | "cyan"
  | "green"
  | "lime"

export const NOTE_COLORS: { name: NoteColor; bg: string; text: string }[] = [
  { name: "yellow", bg: "bg-amber-200", text: "text-amber-900" },
  { name: "orange", bg: "bg-orange-300", text: "text-orange-900" },
  { name: "coral", bg: "bg-orange-400", text: "text-orange-950" },
  { name: "pink", bg: "bg-pink-300", text: "text-pink-900" },
  { name: "purple", bg: "bg-purple-300", text: "text-purple-900" },
  { name: "blue", bg: "bg-blue-300", text: "text-blue-900" },
  { name: "cyan", bg: "bg-cyan-300", text: "text-cyan-900" },
  { name: "green", bg: "bg-emerald-300", text: "text-emerald-900" },
  { name: "lime", bg: "bg-lime-300", text: "text-lime-900" },
]

export function getColorClasses(colorName: string): { bg: string; text: string } {
  const color = NOTE_COLORS.find((c) => c.name === colorName)
  return color || { bg: "bg-amber-200", text: "text-amber-900" }
}
