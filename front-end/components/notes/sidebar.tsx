/**
 * @file sidebar.tsx
 * @description Sidebar navigation component for the dashboard.
 * Provides controls for adding new notes, toggling between active and archived views, and signing out.
 */

"use client"

import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Archive, LogOut } from "lucide-react"

interface SidebarProps {
  onAddNote: () => void
  showArchived: boolean
  onToggleArchived: () => void
}

export function Sidebar({ onAddNote, showArchived, onToggleArchived }: SidebarProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }

  return (
    <aside className="flex w-48 flex-col border-r border-border bg-white p-6">
      <h2 className="mb-8 text-xl font-bold text-foreground">Docket</h2>

      <Button
        onClick={onAddNote}
        size="icon"
        className="mb-8 h-12 w-12 rounded-full"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <nav className="flex flex-1 flex-col gap-2">
        <Button
          variant={showArchived ? "ghost" : "secondary"}
          className="justify-start gap-3"
          onClick={() => showArchived && onToggleArchived()}
        >
          <FileText className="h-5 w-5" />
          Notes
        </Button>
        <Button
          variant={showArchived ? "secondary" : "ghost"}
          className="justify-start gap-3"
          onClick={() => !showArchived && onToggleArchived()}
        >
          <Archive className="h-5 w-5" />
          Archived
        </Button>
      </nav>

      <Button
        variant="ghost"
        className="mt-auto justify-start gap-3 text-muted-foreground hover:text-foreground"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </Button>
    </aside>
  )
}
