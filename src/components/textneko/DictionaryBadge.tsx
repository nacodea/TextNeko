"use client";

import { Button } from "@/components/ui/button";

export function DictionaryBadge({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md bg-muted px-2 py-1 text-xs">
        辞書: {count}件
      </span>
      <Button size="sm" variant="outline" onClick={onOpen}>
        編集
      </Button>
    </div>
  );
}
