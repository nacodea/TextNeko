import type { Preset } from "@/lib/types";
import type { TransformGroup, TransformOption } from "@/store/useTextStore";

/**
 * Transform ベースの初期 state
 */
export const defaultTransform = {
  group: "none" as TransformGroup,
  option: null as TransformOption,
};

/**
 * 初期プリセット一覧
 * すべて transform ベースで定義する
 */
export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "snake_to_camel",
    name: "snake → camel",
    transform: {
      group: "case",
      option: "snakeToCamel",
    },
  },
  {
    id: "camel_to_snake",
    name: "camel → snake",
    transform: {
      group: "case",
      option: "camelToSnake",
    },
  },
  {
    id: "upper",
    name: "大文字化",
    transform: {
      group: "case",
      option: "upper",
    },
  },
  {
    id: "lower",
    name: "小文字化",
    transform: {
      group: "case",
      option: "lower",
    },
  },
  {
    id: "zen_to_han",
    name: "全角 → 半角",
    transform: {
      group: "width",
      option: "zenToHan",
    },
  },
  {
    id: "han_to_zen",
    name: "半角 → 全角",
    transform: {
      group: "width",
      option: "hanToZen",
    },
  },
  {
    id: "slugify",
    name: "スラッグ化",
    transform: {
      group: "slug",
      option: "slugify",
    },
  },
];
