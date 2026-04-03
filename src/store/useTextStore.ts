"use client";

import { create } from "zustand";
import type { Preset } from "@/lib/types";
import { DEFAULT_PRESETS } from "@/lib/presets";
import { useDictionaryStore } from "@/store/useDictionaryStore";

// transforms
import { toUpper } from "@/lib/transforms/toUpper";
import { toLower } from "@/lib/transforms/toLower";
import { snakeToCamel } from "@/lib/transforms/snakeToCamel";
import { camelToSnake } from "@/lib/transforms/camelToSnake";
import { trimEachLine } from "@/lib/transforms/trim";
import { removeEmptyLines } from "@/lib/transforms/removeEmptyLines";
import { zenkakuToHankaku } from "@/lib/transforms/zenkakuToHankaku";
import { hankakuToZenkaku } from "@/lib/transforms/hankakuToZenkaku";
import { toSlug } from "@/lib/transforms/slugify";

export type TransformGroup = "none" | "case" | "width" | "slug";

export type TransformOption =
  | "snakeToCamel"
  | "camelToSnake"
  | "upper"
  | "lower"
  | "zenToHan"
  | "hanToZen"
  | "slugify"
  | null;

type State = {
  input: string;
  output: string;
  presets: Preset[];
  selectedPresetId: string | null;
  transform: {
    group: TransformGroup;
    option: TransformOption;
  };
};

type Actions = {
  setInput: (v: string) => void;
  setTransform: (group: TransformGroup, option: TransformOption) => void;
  apply: () => void;
  reset: () => void;
  loadPreset: (id: string) => void;
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  hydrateFromStorage: () => void; // CSR後に同期
};

const LS_PRESETS = "textneko.presets";
const LS_SELECTED = "textneko.selectedPresetId";

// ── 既存の loadPresets をそのまま活かす ─────────────────────
const loadPresets = (): Preset[] => {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const raw = localStorage.getItem(LS_PRESETS);
    if (!raw) return DEFAULT_PRESETS;
    const parsed = JSON.parse(raw) as Preset[];
    return parsed.length ? parsed : DEFAULT_PRESETS;
  } catch {
    return DEFAULT_PRESETS;
  }
};

const persistPresets = (presets: Preset[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_PRESETS, JSON.stringify(presets));
};

const persistSelected = (id: string | null) => {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(LS_SELECTED, id);
  else localStorage.removeItem(LS_SELECTED);
};

export const useTextStore = create<State & Actions>((set, get) => ({
  input: "",
  output: "",

  transform: {
    group: "none",
    option: null,
  },

  // ★ 初期値から loadPresets() を使う（SSRでは DEFAULT_PRESETS が返る）
  presets: loadPresets(),

  // ★ 起動時は常に (custom) に固定（復元しない）
  selectedPresetId: null,

  setInput: (v) => set({ input: v }),

  setTransform: (group, option) =>
    set(() => ({
      transform: { group, option },
      selectedPresetId: null,
    })),

  apply: () => {
    const { input, transform } = get();
    let out = input;

    const dict = useDictionaryStore.getState().getRuntimeDictionary();

    switch (transform.option) {
      case "snakeToCamel":
        out = out.replace(/\b[a-z0-9_]+\b/gi, snakeToCamel);
        break;

      case "camelToSnake":
        out = out.replace(/\b[a-zA-Z0-9]+\b/g, camelToSnake);
        break;

      case "upper":
        out = toUpper(out);
        break;

      case "lower":
        out = toLower(out);
        break;

      case "zenToHan":
        out = zenkakuToHankaku(out);
        break;

      case "hanToZen":
        out = hankakuToZenkaku(out);
        break;

      case "slugify":
        out = toSlug(out, dict);
        break;

      default:
        // 何もしない
        break;
    }

    set({ output: out });
  },

  reset: () =>
    set({
      input: "",
      output: "",
      transform: { group: "none", option: null },
      selectedPresetId: null,
    }),

  loadPreset: (id) =>
    set((s) => {
      const p = s.presets.find((x) => x.id === id);
      if (!p) return {};
      persistSelected(id);
      return {
        transform: { ...p.transform },
        selectedPresetId: id,
      };
    }),

  savePreset: (name) =>
    set((s) => {
      const id = "p_" + Math.random().toString(36).slice(2, 10);

      const next = [
        ...s.presets,
        {
          id,
          name,
          transform: { ...s.transform }, // ✅ enabled ではなく transform
        },
      ];

      persistPresets(next);
      persistSelected(id);

      return { presets: next, selectedPresetId: id };
    }),

  deletePreset: (id) =>
    set((s) => {
      const next = s.presets.filter((p) => p.id !== id);
      persistPresets(next);
      const nextSelected =
        s.selectedPresetId === id ? null : s.selectedPresetId;
      persistSelected(nextSelected);
      return { presets: next, selectedPresetId: nextSelected };
    }),

  hydrateFromStorage: () => {
    // ★ CSR後にプリセットのみ同期。選択状態は復元しない（= null）
    const nextPresets = loadPresets();
    set({ presets: nextPresets, selectedPresetId: null });
  },
}));
