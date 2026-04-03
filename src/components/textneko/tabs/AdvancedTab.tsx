"use client";

import { useState } from "react";
import { useDictionaryStore } from "@/store/useDictionaryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export function AdvancedTab() {
  const raw = useDictionaryStore((s) => s.raw);
  const setRaw = useDictionaryStore((s) => s.setRaw);

  // ✅ いま開く行の index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const add = () => {
    setRaw({
      ...raw,
      regex: [...raw.regex, { pattern: "", flags: "", replace: "" }],
    });
    setEditingIndex(raw.regex.length); // ✅ 追加直後に開く
  };

  const update = (
    i: number,
    patch: Partial<{ pattern: string; flags?: string; replace: string }>,
  ) => {
    setRaw({
      ...raw,
      regex: raw.regex.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    });
  };

  const remove = (i: number) => {
    setRaw({
      ...raw,
      regex: raw.regex.filter((_, idx) => idx !== i),
    });
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      <ScrollArea className="h-[55vh] pr-2">
        <div className="space-y-2">
          {raw.regex.map((r, i) => (
            <div
              key={i}
              className="flex justify-between rounded-md border px-3 py-2"
            >
              <span className="truncate font-mono text-sm">
                /{r.pattern}/{r.flags} → {r.replace}
              </span>

              <Popover
                open={editingIndex === i}
                onOpenChange={(open) => setEditingIndex(open ? i : null)}
              >
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    編集
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-96 space-y-2">
                  <Input
                    className="font-mono text-xs"
                    placeholder="pattern"
                    value={r.pattern}
                    onChange={(e) => update(i, { pattern: e.target.value })}
                    autoFocus
                  />
                  <Input
                    className="font-mono text-xs"
                    placeholder="flags"
                    value={r.flags ?? ""}
                    onChange={(e) => update(i, { flags: e.target.value })}
                  />
                  <Input
                    className="font-mono text-xs"
                    placeholder="replace"
                    value={r.replace}
                    onChange={(e) => update(i, { replace: e.target.value })}
                  />
                  <div className="flex justify-between pt-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(i)}
                    >
                      削除
                    </Button>
                    <Button size="sm" onClick={() => setEditingIndex(null)}>
                      閉じる
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button size="sm" onClick={add}>
        ＋ 正規表現を追加
      </Button>
    </div>
  );
}
