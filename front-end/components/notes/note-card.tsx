/**
 * @file note-card.tsx
 * @description Display component for an individual note.
 * Handles interactive actions such as pinning, archiving, deleting, and changing note colors via the API.
 */

"use client"

import { useState } from "react"
import { Note, getColorClasses, NOTE_COLORS } from "@/lib/types"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Pencil, Star, Archive, ArchiveRestore, Trash2, Palette, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface NoteCardProps {
  note: Note
  onEdit: () => void
  onDelete: () => void
  onArchive: (note: Note) => void
  onPin: (note: Note) => void
  onColorChange: (note: Note) => void
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  onPin,
  onColorChange,
}: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { bg, text } = getColorClasses(note.color)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.delete(`/notes/${note.id}`)
      onDelete()
    } catch (error) {
      console.error("Failed to delete note", error)
    }
    setIsDeleting(false)
  }

  const handleArchive = async () => {
    try {
      const updatedNote = await api.put<Note>(`/notes/${note.id}/archive`, {
        is_archived: !note.is_archived,
      })
      onArchive(updatedNote)
    } catch (error) {
      // Fallback if specialized endpoint doesn't exist
      try {
        const updatedNote = await api.put<Note>(`/notes/${note.id}`, {
          ...note,
          is_archived: !note.is_archived,
        })
        onArchive(updatedNote)
      } catch (err) {
        console.error("Failed to archive note", err)
      }
    }
  }

  const handlePin = async () => {
    try {
      const updatedNote = await api.put<Note>(`/notes/${note.id}/pin`, {
        is_pinned: !note.is_pinned,
      })
      onPin(updatedNote)
    } catch (error) {
      // Fallback
      try {
        const updatedNote = await api.put<Note>(`/notes/${note.id}`, {
          ...note,
          is_pinned: !note.is_pinned,
        })
        onPin(updatedNote)
      } catch (err) {
        console.error("Failed to pin note", err)
      }
    }
  }

  const handleColorChange = async (color: string) => {
    try {
      const updatedNote = await api.put<Note>(`/notes/${note.id}/color`, {
        color,
      })
      onColorChange(updatedNote)
    } catch (error) {
      // Fallback
      try {
        const updatedNote = await api.put<Note>(`/notes/${note.id}`, {
          ...note,
          color,
        })
        onColorChange(updatedNote)
      } catch (err) {
        console.error("Failed to change color", err)
      }
    }
  }

  return (
    <div
      className={cn(
        "group relative flex min-h-[180px] flex-col rounded-xl p-4 transition-shadow hover:shadow-lg",
        bg,
        text
      )}
    >
      {note.is_pinned && (
        <Star className="absolute right-3 top-3 h-4 w-4 fill-current" />
      )}

      <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">{note.title}</h3>
      {note.content && (
        <p className="mb-4 line-clamp-4 flex-1 text-sm opacity-90">{note.content}</p>
      )}

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs opacity-75">{formatDate(note.created_at)}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin}>
              <Star className="mr-2 h-4 w-4" />
              {note.is_pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              {note.is_archived ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                Change color
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="grid grid-cols-3 gap-1 p-2">
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorChange(color.name)}
                      className={cn(
                        "h-8 w-8 rounded-full transition-transform hover:scale-110",
                        color.bg,
                        note.color === color.name && "ring-2 ring-foreground ring-offset-2"
                      )}
                    />
                  ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
