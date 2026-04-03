import { toRomaji } from "wanakana";
import TinySegmenter from "tiny-segmenter";
import type { CompiledDictionary } from "@/lib/dictionaries/types";
import {
  JA_EN_EXACT_DEFAULT,
  JA_EN_REGEX_DEFAULT,
} from "@/lib/dictionaries/defaults";

// ────────────────────────────────────────────
// Utilities
// ────────────────────────────────────────────
const DELIM = "§"; // 一時区切り（入力に通常出現しない文字）

// TinySegmenter は軽量なのでクライアントで遅延初期化
let _seg: TinySegmenter | null = null;
function seg(text: string): string[] {
  if (!_seg) _seg = new TinySegmenter();
  return _seg.segment(text);
}

// 変更点の要旨：最長一致で exact を先に当てて、残差だけを分割処理
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildActiveDict(user?: CompiledDictionary): {
  exact: Record<string, string>;
  regex: Array<{ pattern: RegExp; replace: string }>;
} {
  if (!user) {
    return { exact: JA_EN_EXACT_DEFAULT, regex: JA_EN_REGEX_DEFAULT };
  }
  // useDictionaryStore 側で defaults を統合済み（modeに応じて）
  return { exact: user.exact, regex: user.regex };
}

/**
 * 正規表現ルールを先に適用（例: 第3回 → round-3）
 */
function applyRegexFirst(
  text: string,
  rules: Array<{ pattern: RegExp; replace: string }>,
) {
  let out = text;
  for (const r of rules) out = out.replace(r.pattern, r.replace);
  return out;
}

/**
 * exact の最長一致を「マーカー付き」で適用。
 * 例: "顧客"→"customer" なら "§customer§" として挿入し、英語ブロックを後段で確実に分割させる。
 */
function applyExactWithDelims(text: string, exact: Record<string, string>) {
  const keys = Object.keys(exact).sort((a, b) => b.length - a.length); // 長い順
  let out = text;
  for (const k of keys) {
    if (!k) continue;
    const v = exact[k] ?? "";
    // 空文字にしたい（例: 助詞「の」→""）場合も、前後のマーカーだけは入れておくと後段で「--」になるので
    // 最後の正規化でまとめて1つのハイフンに圧縮されます。
    const wrapped = v ? `${DELIM}${v}${DELIM}` : `${DELIM}${DELIM}`;
    out = out.replace(new RegExp(escapeRegExp(k), "g"), wrapped);
  }
  return out;
}

/**
 * 「残った日本語」部分を TinySegmenter で分割し、それぞれ辞書かローマ字へ。
 * すでに英語に確定した部分（DELIM に挟まれた塊）はそのまま使う。
 */
function explodeByDelimAndNormalize(
  text: string,
  exact: Record<string, string>,
): string[] {
  // 1) DELIM で分割（空も保持して後段でフィルタ）
  const chunks = text.split(DELIM);

  const tokens: string[] = [];

  for (const chunk of chunks) {
    const t = chunk.trim();
    if (!t) continue;

    // 2) すでに英数/ハイフン構成ならそのまま単語として採用
    if (/^[a-z0-9-]+$/i.test(t)) {
      tokens.push(t);
      continue;
    }

    // 3) それ以外（日本語や記号を含む）は TinySegmenter で分割しつつ辞書/ローマ字化
    for (const tk of seg(t)) {
      const s = tk.trim();
      if (!s) continue;
      if (exact[s] !== undefined) {
        const mapped = exact[s];
        if (mapped) tokens.push(mapped);
        // mapped が空文字のときは何もpushしない（助詞など除去）
      } else {
        // ローマ字フォールバック
        const roma = toRomaji(s);
        if (roma && roma.trim()) tokens.push(roma);
      }
    }
  }

  return tokens;
}

export const toSlug = (text: string, userCompiledDict?: CompiledDictionary) => {
  const { exact, regex } = buildActiveDict(userCompiledDict);

  // 1) regex 先当て
  let pre = applyRegexFirst(text, regex);

  // 2) exact（最長一致）をマーカー付きで適用
  pre = applyExactWithDelims(pre, exact);

  // 3) マーカー単位 + TinySegmenter でトークン化して辞書/ローマ字へ
  const tokens = explodeByDelimAndNormalize(pre, exact);

  // 4) slug 正規化
  return tokens
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // 許容外をハイフンへ
    .replace(/-+/g, "-") // 連続ハイフン圧縮
    .replace(/^-+|-+$/g, ""); // 前後のハイフン除去
};
