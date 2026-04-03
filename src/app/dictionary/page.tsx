"use client";

import { useEffect, useRef, useState } from "react";
import { useDictionaryStore } from "@/store/useDictionaryStore";
import type { UserDictionary } from "@/lib/dictionaries/types";

export default function DictionaryPage() {
  const {
    raw,
    setRaw,
    importFromJson,
    exportToJson,
    resetToDefaults,
    resetToEmpty,
    loadFromStorage,
  } = useDictionaryStore();

  const [local, setLocal] = useState<UserDictionary>(raw);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFromStorage();
    // 反映
    setLocal(useDictionaryStore.getState().raw);
  }, [loadFromStorage]);

  // raw の変更が入った場合に追随
  useEffect(() => {
    setLocal(raw);
  }, [raw]);

  const addExactRow = () => {
    const copy = { ...local, exact: { ...local.exact } };
    // 空キー重複を避けるためテンポラリ名を生成
    let i = 1;
    while (copy.exact[`新規語${i}`] !== undefined) i++;
    copy.exact[`新規語${i}`] = "new-term";
    setLocal(copy);
  };

  const removeExactKey = (key: string) => {
    const copy = { ...local, exact: { ...local.exact } };
    delete copy.exact[key];
    setLocal(copy);
  };

  const renameExactKey = (oldKey: string, newKey: string) => {
    if (!newKey || oldKey === newKey) return;
    const copy = { ...local, exact: { ...local.exact } } as UserDictionary;
    const val = copy.exact[oldKey];
    delete copy.exact[oldKey];
    copy.exact[newKey] = val;
    setLocal(copy);
  };

  const setExactValue = (key: string, value: string) => {
    const copy = { ...local, exact: { ...local.exact } };
    copy.exact[key] = value;
    setLocal(copy);
  };

  const addRegexRow = () => {
    const copy = { ...local, regex: [...local.regex] };
    copy.regex.push({ pattern: "^(サンプル)$", replace: "sample", flags: "" });
    setLocal(copy);
  };

  const updateRegexRow = (
    idx: number,
    field: "pattern" | "replace" | "flags",
    value: string,
  ) => {
    const copy = { ...local, regex: [...local.regex] };
    copy.regex[idx] = { ...copy.regex[idx], [field]: value };
    setLocal(copy);
  };

  const removeRegexRow = (idx: number) => {
    const copy = { ...local, regex: [...local.regex] };
    copy.regex.splice(idx, 1);
    setLocal(copy);
  };

  const onImportClick = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const res = importFromJson(text);
    if (!res.ok) {
      alert("インポート失敗: " + res.error);
    } else {
      alert("インポートしました");
    }
    e.currentTarget.value = ""; // 同じファイル再選択できるように
  };

  const onExportClick = () => {
    const json = exportToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "textneko-dictionary.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onApply = () => {
    // zod パース・保存・コンパイルまで setRaw がやってくれる
    setRaw(local);
    alert("辞書を保存しました");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">辞書エディタ</h1>
        <div className="flex gap-2">
          <button
            className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
            onClick={onImportClick}
          >
            インポート（JSON）
          </button>
          <button
            className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
            onClick={onExportClick}
          >
            エクスポート（JSON）
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onFileSelected}
          />
        </div>
      </header>

      {/* モード */}
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">適用モード</label>
          <select
            className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm"
            value={local.mode}
            onChange={(e) =>
              setLocal({
                ...local,
                mode: e.target.value as UserDictionary["mode"],
              })
            }
          >
            <option value="extend">
              extend（既定 + ユーザー：ユーザー優先）
            </option>
            <option value="override">override（ユーザー辞書のみ）</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button
              className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
              onClick={resetToDefaults}
            >
              既定に戻す（ユーザー辞書空）
            </button>
            <button
              className="rounded border bg-white px-3 py-1.5 text-sm text-red-600 shadow-sm hover:bg-red-50"
              onClick={resetToEmpty}
            >
              全消去（ユーザー辞書空）
            </button>
          </div>
        </div>
      </section>

      {/* exact セクション */}
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            用語（完全一致置換：exact）
          </h2>
          <button
            className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
            onClick={addExactRow}
          >
            行を追加
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="border px-2 py-1 text-left">日本語（キー）</th>
                <th className="border px-2 py-1 text-left">英語（値）</th>
                <th className="border px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(local.exact).map(([k, v]) => (
                <tr key={k}>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full rounded border px-2 py-1"
                      defaultValue={k}
                      onBlur={(e) => {
                        const newKey = e.target.value.trim();
                        if (!newKey || newKey === k) return;
                        renameExactKey(k, newKey);
                      }}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full rounded border px-2 py-1"
                      value={v}
                      onChange={(e) => setExactValue(k, e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <button
                      className="rounded border bg-white px-2 py-1 text-xs text-red-600 shadow-sm hover:bg-red-50"
                      onClick={() => removeExactKey(k)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              {Object.keys(local.exact).length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="border px-2 py-6 text-center text-zinc-400"
                  >
                    まだ項目がありません。「行を追加」を押してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* regex セクション */}
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">正規表現置換（regex）</h2>
          <button
            className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
            onClick={addRegexRow}
          >
            行を追加
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="border px-2 py-1 text-left">pattern</th>
                <th className="border px-2 py-1 text-left">flags</th>
                <th className="border px-2 py-1 text-left">replace</th>
                <th className="border px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {local.regex.map((r, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full rounded border px-2 py-1 font-mono"
                      value={r.pattern}
                      onChange={(e) =>
                        updateRegexRow(i, "pattern", e.target.value)
                      }
                      placeholder="^第(\\d+)回$"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-24 rounded border px-2 py-1 font-mono"
                      value={r.flags ?? ""}
                      onChange={(e) =>
                        updateRegexRow(i, "flags", e.target.value)
                      }
                      placeholder="gi"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full rounded border px-2 py-1 font-mono"
                      value={r.replace}
                      onChange={(e) =>
                        updateRegexRow(i, "replace", e.target.value)
                      }
                      placeholder="round-$1"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <button
                      className="rounded border bg-white px-2 py-1 text-xs text-red-600 shadow-sm hover:bg-red-50"
                      onClick={() => removeRegexRow(i)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              {local.regex.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="border px-2 py-6 text-center text-zinc-400"
                  >
                    まだ正規表現がありません。「行を追加」を押してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-2">
        <button
          className="rounded border bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
          onClick={() => setLocal(useDictionaryStore.getState().raw)}
        >
          破棄（最後に保存した状態を再読込）
        </button>
        <button
          className="rounded bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
          onClick={onApply}
        >
          保存して適用
        </button>
      </div>
    </div>
  );
}
