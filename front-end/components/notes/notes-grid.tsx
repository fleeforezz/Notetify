"use client"

/**
 * @file notes-grid.tsx
 * @description Layout component for displaying a grid of note cards.
 * Receives the list of notes and action handlers, rendering a NoteCard for each.
 */

import { Note } from "@/lib/types"
import { NoteCard } from "./note-card"

interface NotesGridProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (noteId: string) => void
  onArchive: (note: Note) => void
  onPin: (note: Note) => void
  onColorChange: (note: Note) => void
}

export function NotesGrid({
  notes,
  onEdit,
  onDelete,
  onArchive,
  onPin,
  onColorChange,
}: NotesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
          onArchive={() => onArchive(note)}
          onPin={() => onPin(note)}
          onColorChange={(updatedNote) => onColorChange(updatedNote)}
        />
      ))}
    </div>
  )
}
