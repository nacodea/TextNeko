"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDictionaryStore } from "@/store/useDictionaryStore";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ManageTab() {
  const importFromJson = useDictionaryStore((s) => s.importFromJson);
  const exportToJson = useDictionaryStore((s) => s.exportToJson);

  const [text, setText] = useState("");

  const onImport = () => {
    const res = importFromJson(text);
    if (!res.ok) {
      toast.error(res.error);
    } else {
      toast("インポートしました");
    }
  };

  const onExport = () => {
    setText(exportToJson());
    toast("エクスポートしました");
  };

  return (
    <div className="space-y-3">
      <ScrollArea className="h-[45vh]">
        <Textarea
          className="min-h-50 font-mono text-xs resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに JSON を貼り付け / エクスポート内容が表示されます"
        />
      </ScrollArea>

      <div className="flex gap-2">
        <Button size="sm" onClick={onImport}>
          インポート
        </Button>
        <Button size="sm" variant="outline" onClick={onExport}>
          エクスポート
        </Button>
      </div>
    </div>
  );
}
