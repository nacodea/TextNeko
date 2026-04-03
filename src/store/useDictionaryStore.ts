"use client";

import { create } from "zustand";
import {
  UserDictionary,
  UserDictionarySchema,
  CompiledDictionary,
} from "@/lib/dictionaries/types";
import {
  JA_EN_EXACT_DEFAULT,
  JA_EN_REGEX_DEFAULT,
} from "@/lib/dictionaries/defaults";

const LS_KEY = "textneko.dictionary.v1";

function compileDict(user: UserDictionary): CompiledDictionary {
  const regexCompiled = user.regex
    .map((r) => {
      try {
        return {
          pattern: new RegExp(r.pattern, r.flags ?? ""),
          replace: r.replace,
        };
      } catch {
        // 無効な正規表現は無視
        return null;
      }
    })
    .filter(Boolean) as Array<{ pattern: RegExp; replace: string }>;

  return {
    mode: user.mode,
    exact: user.exact,
    regex: regexCompiled,
  };
}

function mergeWithDefaults(compiled: CompiledDictionary): CompiledDictionary {
  if (compiled.mode === "override") {
    return compiled; // 完全にユーザー辞書だけ
  }
  // extend: 既定 + ユーザー（ユーザー優先で上書き）
  return {
    mode: "extend",
    exact: { ...JA_EN_EXACT_DEFAULT, ...compiled.exact },
    regex: [...JA_EN_REGEX_DEFAULT, ...compiled.regex],
  };
}

type DictState = {
  raw: UserDictionary; // UIで編集する生データ
  compiled: CompiledDictionary; // 変換で使う（既定と統合後）
};

type DictActions = {
  loadFromStorage: () => void;
  resetToEmpty: () => void;
  resetToDefaults: () => void; // mode=extend, exact/regex空の推奨初期値
  setRaw: (next: UserDictionary) => void;
  importFromJson: (
    jsonText: string,
  ) => { ok: true } | { ok: false; error: string };
  exportToJson: () => string;
  getRuntimeDictionary: () => CompiledDictionary; // 既定との統合後を返す
  getRawDictionary: () => UserDictionary;
};

export const useDictionaryStore = create<DictState & DictActions>(
  (set, get) => ({
    raw: { mode: "extend", exact: {}, regex: [] },
    compiled: mergeWithDefaults(
      compileDict({ mode: "extend", exact: {}, regex: [] }),
    ),

    loadFromStorage: () => {
      try {
        const rawStr = localStorage.getItem(LS_KEY);
        if (!rawStr) return;
        const parsed = JSON.parse(rawStr);
        const safe = UserDictionarySchema.parse(parsed);
        const compiled = compileDict(safe);
        set({ raw: safe, compiled: mergeWithDefaults(compiled) });
      } catch {
        // 破損時は無視
      }
    },

    resetToEmpty: () => {
      const raw = {
        mode: "extend",
        exact: {},
        regex: [],
      } satisfies UserDictionary;
      const compiled = compileDict(raw);
      localStorage.setItem(LS_KEY, JSON.stringify(raw));
      set({ raw, compiled: mergeWithDefaults(compiled) });
    },

    resetToDefaults: () => {
      // 既定辞書を利用する推奨初期状態（= ユーザー辞書は空）
      const raw = {
        mode: "extend",
        exact: {},
        regex: [],
      } satisfies UserDictionary;
      const compiled = compileDict(raw);
      localStorage.setItem(LS_KEY, JSON.stringify(raw));
      set({ raw, compiled: mergeWithDefaults(compiled) });
    },

    setRaw: (next) => {
      try {
        const safe = UserDictionarySchema.parse(next);
        const compiled = compileDict(safe);
        localStorage.setItem(LS_KEY, JSON.stringify(safe));
        set({ raw: safe, compiled: mergeWithDefaults(compiled) });
      } catch {
        /* UI側で zod error を出す設計でもOK */
      }
    },

    importFromJson: (jsonText) => {
      try {
        const parsed = JSON.parse(jsonText);
        const safe = UserDictionarySchema.parse(parsed);
        const compiled = compileDict(safe);
        localStorage.setItem(LS_KEY, JSON.stringify(safe));
        set({ raw: safe, compiled: mergeWithDefaults(compiled) });
        return { ok: true as const };
      } catch (e: any) {
        const msg = e?.message ?? "JSONの解析/検証に失敗しました。";
        return { ok: false as const, error: msg };
      }
    },

    exportToJson: () => {
      const { raw } = get();
      return JSON.stringify(raw, null, 2);
    },

    getRuntimeDictionary: () => {
      const { compiled } = get();
      return compiled;
    },

    getRawDictionary: () => {
      const { raw } = get();
      return raw;
    },
  }),
);
