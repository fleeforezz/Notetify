/**
 * @file notes-container.tsx
 * @description State management container for the notes dashboard.
 * Coordinates filtering, searching, and opening the note modal, passing state down to the grid and sidebar.
 */

"use client"

import { useState } from "react"
import { Note } from "@/lib/types"
import { Sidebar } from "./sidebar"
import { NotesGrid } from "./notes-grid"
import { NoteModal } from "./note-modal"
import { SearchBar } from "./search-bar"

interface NotesContainerProps {
  initialNotes: Note[]
}

export function NotesContainer({ initialNotes }: NotesContainerProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesArchiveFilter = showArchived ? note.is_archived : !note.is_archived
    return matchesSearch && matchesArchiveFilter
  })

  const pinnedNotes = filteredNotes.filter((note) => note.is_pinned && !note.is_archived)
  const unpinnedNotes = filteredNotes.filter((note) => !note.is_pinned || note.is_archived)

  const handleAddNote = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleSaveNote = (savedNote: Note) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === savedNote.id ? savedNote : n)))
    } else {
      setNotes([savedNote, ...notes])
    }
    setIsModalOpen(false)
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  const handleArchiveNote = (updatedNote: Note) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
  }

  const handlePinNote = (updatedNote: Note) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
  }

  const handleColorChange = (updatedNote: Note) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <Sidebar
        onAddNote={handleAddNote}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />

      <main className="flex-1 p-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <h1 className="mb-8 text-4xl font-bold text-foreground">
          {showArchived ? "Archived" : "Notes"}
        </h1>

        {!showArchived && pinnedNotes.length > 0 && (
          <>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Pinned
            </h2>
            <NotesGrid
              notes={pinnedNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onArchive={handleArchiveNote}
              onPin={handlePinNote}
              onColorChange={handleColorChange}
            />
            <h2 className="mb-4 mt-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Others
            </h2>
          </>
        )}

        <NotesGrid
          notes={showArchived ? filteredNotes : unpinnedNotes}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onArchive={handleArchiveNote}
          onPin={handlePinNote}
          onColorChange={handleColorChange}
        />

        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-muted-foreground">
              {showArchived
                ? "No archived notes"
                : searchQuery
                  ? "No notes match your search"
                  : "No notes yet. Click + to create one!"}
            </p>
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNote(null)
        }}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  )
}
