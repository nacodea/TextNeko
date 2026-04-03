import { z } from "zod";

// ユーザーがJSONで扱うフォーマット（UI・インポート/エクスポート用）
export const UserDictionarySchema = z.object({
  mode: z.enum(["extend", "override"]).default("extend"),
  exact: z.record(z.string(), z.string()).default({}),
  regex: z
    .array(
      z.object({
        pattern: z.string(), // 正規表現文字列（/ は含めない）
        replace: z.string(),
        flags: z.string().optional(), // 例: "i", "g", "gi"
      }),
    )
    .default([]),
});
export type UserDictionary = z.infer<typeof UserDictionarySchema>;

// 変換実行時に使う、コンパイル後の辞書
export type CompiledDictionary = {
  mode: "extend" | "override";
  exact: Record<string, string>;
  regex: Array<{ pattern: RegExp; replace: string }>;
};
