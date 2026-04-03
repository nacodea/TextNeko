"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDictionaryStore } from "@/store/useDictionaryStore";
import { useState, useEffect } from "react";

export function ExactDictionaryRow({
  k,
  v,
  open,
  onOpenChange,
}: {
  k: string;
  v: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const raw = useDictionaryStore((s) => s.raw);
  const setRaw = useDictionaryStore((s) => s.setRaw);

  // ✅ 編集用ローカル state
  const [keyDraft, setKeyDraft] = useState(k);
  const [valueDraft, setValueDraft] = useState(v);

  // Popoverを開くたびに最新値を反映
  useEffect(() => {
    if (open) {
      setKeyDraft(k);
      setValueDraft(v);
    }
  }, [open, k, v]);

  /** ✅ 保存（キー変更対応） */
  const save = () => {
    if (!keyDraft.trim()) return;

    const nextExact = { ...raw.exact };

    // 古いキーを削除
    delete nextExact[k];

    // 新しいキーで追加
    nextExact[keyDraft] = valueDraft;

    setRaw({
      ...raw,
      exact: nextExact,
    });

    onOpenChange(false);
  };

  /** ✅ 削除 */
  const remove = () => {
    const nextExact = { ...raw.exact };
    delete nextExact[k];

    setRaw({
      ...raw,
      exact: nextExact,
    });

    onOpenChange(false);
  };

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="truncate font-mono text-sm">
        {k} → {v}
      </span>

      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            編集
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 space-y-2">
          {/* ✅ キー編集 */}
          <Input
            className="font-mono text-sm"
            placeholder="key"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            autoFocus
          />

          {/* ✅ 値編集 */}
          <Input
            className="font-mono text-sm"
            placeholder="value"
            value={valueDraft}
            onChange={(e) => setValueDraft(e.target.value)}
          />

          <div className="flex justify-between pt-2">
            <Button size="sm" variant="destructive" onClick={remove}>
              削除
            </Button>
            <Button size="sm" onClick={save}>
              保存
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
