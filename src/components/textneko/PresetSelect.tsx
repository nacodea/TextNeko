"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PresetSelect({
  presets,
  selectedId,
  onSelect,
}: {
  presets: { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-64 animate-pulse rounded bg-muted" />;
  }

  return (
    <Select value={selectedId ?? ""} onValueChange={onSelect}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="プリセットを選択" />
      </SelectTrigger>
      <SelectContent>
        {presets.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
