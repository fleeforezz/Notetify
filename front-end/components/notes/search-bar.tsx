"use client"

/**
 * @file search-bar.tsx
 * @description Input component for searching and filtering notes by title or content.
 */

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-8 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white pl-10"
      />
    </div>
  )
}
