"use client";

import { useEffect, useMemo, useState } from "react";
import { useTextStore } from "@/store/useTextStore";
import { useDictionaryStore } from "@/store/useDictionaryStore";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { TransformPanel } from "@/components/textneko/TransformPanel";
import { InputSection } from "@/components/textneko/InputSection";
import { OutputSection } from "@/components/textneko/OutputSection";
import { PresetSelect } from "@/components/textneko/PresetSelect";
import { ImportDialog } from "@/components/textneko/ImportDialog";

import { DictionaryBadge } from "@/components/textneko/DictionaryBadge";
import { DictionaryEditorSheet } from "@/components/textneko/DictionaryEditorSheet";

import { TransformChecks } from "@/components/textneko/TransformChecks";
import { Shuffle, ArrowDownUp } from "lucide-react";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";

export default function Page() {
  const [dictOpen, setDictOpen] = useState(false);

  const dictCount = useDictionaryStore(
    (s) => Object.keys(s.getRuntimeDictionary().exact).length,
  );

  const {
    input,
    output,
    transform,
    presets,
    selectedPresetId,
    loadPreset,
    savePreset,
    deletePreset,
    setInput,
    apply,
    reset,
  } = useTextStore();

  const { importFromJson, exportToJson, loadFromStorage } =
    useDictionaryStore();

  const [newPresetName, setNewPresetName] = useState("");

  useEffect(() => {
    // CSR 同期
    loadFromStorage?.();
    useTextStore.getState().hydrateFromStorage?.();

    // 次 tick で apply（Zustand の set 反映を待つ）
    const id = setTimeout(() => useTextStore.getState().apply(), 0);
    return () => clearTimeout(id);
  }, [loadFromStorage]);

  const isNoneSelected = transform.option === null;

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      toast("クリップボードから読み取りできませんでした。");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast("コピーしました");
    } catch {
      toast.error("コピーに失敗しました。");
    }
  };

  const doImport = (jsonText: string) => {
    const res = importFromJson(jsonText);
    if (res.ok) toast("インポートしました");
    else toast(`インポート失敗: ${res.error}`);
  };

  const doExport = () => {
    const json = exportToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "textneko-dictionary.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    toast("エクスポートしました");
  };

  const transformLabelMap: Record<string, string> = {
    snakeToCamel: "snake → camel",
    camelToSnake: "camel → snake",
    upper: "大文字化",
    lower: "小文字化",
    zenToHan: "全角 → 半角",
    hanToZen: "半角 → 全角",
    slugify: "スラッグ化",
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        {/* 変換オプション */}
        <TransformPanel title="Transformations">
          {/* プリセット列 */}
          <div className="flex flex-wrap items-center gap-2">
            <PresetSelect
              presets={presets}
              selectedId={selectedPresetId}
              onSelect={(id) => id && loadPreset(id)}
            />

            <div className="flex items-center gap-2">
              <input
                className="w-44 rounded-md border bg-background px-3 py-1.5 text-sm"
                placeholder="新規プリセット名"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (!newPresetName.trim()) return;
                  savePreset(newPresetName.trim());
                  setNewPresetName("");
                  toast("プリセットを保存しました");
                }}
              >
                保存
              </Button>
              <Button variant="outline" onClick={reset}>
                リセット
              </Button>
            </div>

            {selectedPresetId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  deletePreset(selectedPresetId);
                  toast("プリセットを削除しました");
                }}
              >
                選択プリセットを削除
              </Button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs">
                辞書: {dictCount}件
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setDictOpen(true)}
              >
                編集
              </Button>
            </div>
          </div>

          {/* チェック群 */}
          <TransformChecks />

          {/* 実行ボタン群 */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="ml-auto flex items-center gap-2">
              <ImportDialog onImport={doImport} />
              <Button variant="outline" size="sm" onClick={doExport}>
                エクスポート（JSON）
              </Button>
            </div>
          </div>
        </TransformPanel>
      </div>

      {/* ✅ Transformations と I/O の間の余白 */}
      <div className="mt-6" />

      {/* 🔵 Input / Transform / Output */}
      <div
        className="grid gap-4
  grid-cols-1
  md:grid-cols-[1fr_auto_1fr]
  items-start"
      >
        {/* ===== Input ===== */}
        <TransformPanel title="Input">
          <InputSection
            value={input}
            onChange={setInput}
            onPaste={pasteFromClipboard}
            onClear={() => setInput("")}
          />
        </TransformPanel>

        {/* ===== Transform Button ===== */}

        {/* ===== Transform Button ===== */}
        <div
          className="
  flex h-full
  items-center justify-center
"
        >
          <Button
            onClick={apply}
            disabled={transform.option === null}
            variant="default"
            size="icon"
            className="h-10 w-10"
            aria-label="変換する"
          >
            {/* モバイル：縦 / PC：横 */}
            <ArrowDownUp className="h-5 w-5 md:hidden" />
            <Shuffle className="hidden h-5 w-5 md:block" />
          </Button>
        </div>

        {/* ===== Output ===== */}
        <TransformPanel
          title={
            <div className="flex items-center gap-2">
              <span>Output</span>
              {transform.option && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  今の変換: {transformLabelMap[transform.option]}
                </span>
              )}
            </div>
          }
        >
          <OutputSection value={output} onCopy={copyToClipboard} />
        </TransformPanel>
      </div>

      {/* ✅ これを div の外・Fragment 直下に置く */}
      <DictionaryEditorSheet open={dictOpen} onOpenChange={setDictOpen} />

      <BuyMeACoffee />
    </>
  );
}
