# TextNeko 🐾

**テキスト変換を、分かりやすく・安全に行うための Web ツール**

TextNeko は、開発や業務でよく使われるテキスト変換を
**直感的な UI と予測しやすい挙動**で行うことを目的とした Web アプリケーションです。

## Demo

👉 https://text-neko.vercel.app

☕ 気に入っていただけたら、開発を応援してもらえると嬉しいです

[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Support%20TextNeko&emoji=🐾&slug=nacodea&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/nacodea)

---

## ✨ 特徴

- ✅ **排他的で分かりやすい変換 UI**
  - snake / camel
  - 大文字 / 小文字
  - 全角 / 半角
  - スラッグ化
- ✅ **変換は常に 1 つだけ適用**（予期しない挙動を防止）
- ✅ **入力 → 変換 → 出力が視覚的に分かるレイアウト**
- ✅ **正規表現対応のユーザー辞書**
- ✅ **プリセット保存・呼び出し**
- ✅ **ローカル保存（サーバー不要）**

---

## 🖥 画面構成

- **Transformations（上部・固定）**
  - 変換種別の選択
  - プリセット管理
  - 辞書エディタへのアクセス
- **Input / Output**
  - 入力と出力を左右（モバイルでは上下）に表示
  - 中央に変換ボタンを配置
- **現在の変換状態が Output に表示**

---

## 🔄 対応している変換

### Case 変換

- snake → camel
- camel → snake
- 大文字化
- 小文字化

### 全角/半角変換

- 全角 → 半角
- 半角 → 全角

### その他

- スラッグ化（日本語対応 / 辞書併用）

※ 各グループは **同時に 1 つのみ選択可能**です。

---

## 📚 ユーザー辞書

- Exact（完全一致）
- Regex（正規表現）
- JSON インポート / エクスポート対応
- ローカルストレージ保存

辞書はスラッグ化などで利用されます。

---

## 📌 プリセット

- 現在の変換設定をプリセットとして保存
- ワンクリックで呼び出し
- transform（変換状態）ベース設計

---

## 🧠 設計思想

- **変換は「選択式・排他制御」**
  - 複数変換による意図しない結果を防ぐ
- **状態と UI を 1:1 に対応**
  - `transform.group / transform.option` を唯一の真実に
- **ロジックは store に集約**
  - コンポーネントは表示と操作に専念

---

## 🛠 技術スタック

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Zustand**
- **Tailwind CSS**
- **shadcn/ui**
- **lucide-react**

---

## 🚀 起動方法

```bash
pnpm install
pnpm dev
```

以下にアクセス：
http://localhost:3000

## 📦 ディレクトリ構成（抜粋）

```
src/
├─ app/
│ └─ page.tsx
├─ components/
│ └─ textneko/
│ ├─ TransformChecks.tsx
│ ├─ InputSection.tsx
│ ├─ OutputSection.tsx
│ └─ DictionaryEditorSheet.tsx
├─ store/
│ ├─ useTextStore.ts
│ └─ useDictionaryStore.ts
├─ lib/
│ ├─ transforms/
│ └─ presets.ts
```

## 📄 ライセンス

MIT License

## 👤 作者

- 名前: Naoya Takahashi
- メール: crossgame331@outlook.jp
