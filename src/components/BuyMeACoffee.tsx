"use client";

import { useEffect } from "react";

export function BuyMeACoffeeModal() {
  useEffect(() => {
    // ✅ すでに読み込まれていたら何もしない
    if (document.getElementById("buymeacoffee-widget")) return;

    const script = document.createElement("script");
    script.id = "buymeacoffee-widget";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.async = true;

    script.dataset.name = "BMC-Widget";
    script.dataset.id = "ユーザー名"; // ← 必ず自分のID
    script.dataset.description = "Support me";
    script.dataset.message = "もしTextNekoが役に立ったら☕";
    script.dataset.color = "#FFDD00";
    script.dataset.position = "Right";
    script.dataset.xMargin = "18";
    script.dataset.yMargin = "18";

    document.body.appendChild(script);

    // ❌ cleanup では削除しない（重要）
  }, []);

  return null;
}
