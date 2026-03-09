/**
 * @file note-modal.tsx
 * @description Modal component for creating and editing notes.
 * Communicates with the Spring Boot API to save changes and manages local state for the form.
 */

"use client"

import { useState, useEffect } from "react"
import { Note, NOTE_COLORS, getColorClasses } from "@/lib/types"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
  onSave: (note: Note) => void
}

export function NoteModal({ isOpen, onClose, note, onSave }: NoteModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<string>("yellow")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || "")
      setColor(note.color)
    } else {
      setTitle("")
      setContent("")
      setColor("yellow")
    }
  }, [note, isOpen])

  const handleSave = async () => {
    if (!title.trim()) return

    setSaving(true)

    try {
      if (note) {
        const updatedNote = await api.put<Note>(`/notes/${note.id}`, {
          title: title.trim(),
          content: content.trim() || null,
          color,
        })
        onSave(updatedNote)
      } else {
        const newNote = await api.post<Note>("/notes", {
          title: title.trim(),
          content: content.trim() || null,
          color,
        })
        onSave(newNote)
      }
    } catch (error) {
      console.error("Failed to save note", error)
    }

    setSaving(false)
  }

  const { bg } = getColorClasses(color)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />

          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Color</p>
            <div className="flex flex-wrap gap-2">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform hover:scale-110",
                    c.bg,
                    color === c.name && "ring-2 ring-foreground ring-offset-2"
                  )}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg p-4",
              bg
            )}
          >
            <p className="text-sm font-medium">Preview</p>
            <p className="mt-1 text-xs opacity-75">
              {title || "Your note title will appear here"}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? "Saving..." : note ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
