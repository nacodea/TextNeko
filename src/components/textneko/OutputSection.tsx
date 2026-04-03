"use client";

import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onCopy: () => void;
  transformLabel?: string;
};

export function OutputSection({ value, onCopy, transformLabel }: Props) {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="ml-auto flex gap-2">
        <Button size="sm" variant="outline" onClick={onCopy}>
          コピー
        </Button>
      </div>
      <textarea
        className="min-h-35 font-mono text-sm border bg-background p-2"
        value={value}
        readOnly
      />
    </div>
  );
}
