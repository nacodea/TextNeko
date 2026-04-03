"use client";

import { useState } from "react";
import { useDictionaryStore } from "@/store/useDictionaryStore";
import { ExactDictionaryRow } from "./ExactDictionaryRow";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BasicTab() {
  const raw = useDictionaryStore((s) => s.raw);
  const setRaw = useDictionaryStore((s) => s.setRaw);

  // ✅ いま開く行のキー
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const addExact = () => {
    const nextExact = { ...raw.exact };
    let i = 1;
    while (nextExact[`new_key_${i}`]) i++;
    const newKey = `new_key_${i}`;
    nextExact[newKey] = "";

    setRaw({ ...raw, exact: nextExact });
    setEditingKey(newKey); // ✅ 追加直後に開く
  };

  return (
    <div className="space-y-3">
      <ScrollArea className="h-[55vh] pr-2">
        <div className="space-y-2">
          {Object.entries(raw.exact).map(([k, v]) => (
            <ExactDictionaryRow
              key={k}
              k={k}
              v={v}
              open={editingKey === k}
              onOpenChange={(open) => setEditingKey(open ? k : null)}
            />
          ))}
        </div>
      </ScrollArea>

      <Button size="sm" onClick={addExact}>
        ＋ 追加
      </Button>
    </div>
  );
}
