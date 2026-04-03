"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ImportDialog({
  onImport,
}: {
  onImport: (json: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          インポート（JSON）
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-160">
        <DialogHeader>
          <DialogTitle>辞書インポート</DialogTitle>
        </DialogHeader>
        <Textarea
          className="min-h-50 font-mono text-xs"
          placeholder='{"mode":"extend","exact":{...},"regex":[...] }'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={() => onImport(text)}>読み込む</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
