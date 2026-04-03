"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function InputSection({
  value,
  onChange,
  onPaste,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onPaste: () => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* <h2 className="text-sm font-semibold">Input</h2> */}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={onPaste}>
            貼り付け
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            クリア
          </Button>
        </div>
      </div>
      <Textarea
        className="min-h-35 font-mono text-sm"
        placeholder="ここにテキストをペースト"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
