"use client";
import { Toaster } from "@/components/ui/sonner"; // ← 新: shadcn ラッパー

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* 好みで設定：richColors / position / expand など */}
      <Toaster position="bottom-right" richColors expand visibleToasts={5} />
    </>
  );
}
