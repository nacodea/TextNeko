"use client";

import { useEffect } from "react";

export default function BuyMeACoffeeWidget() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.async = true;

    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-id", "nacodea"); // ← 必須
    script.setAttribute(
      "data-description",
      "このツールが役に立ったら応援してもらえると嬉しいです ☕",
    );
    script.setAttribute("data-color", "#5F7FFF");
    script.setAttribute("data-position", "Right");

    document.body.appendChild(script);

    return () => {
      // 再マウント防止（ルーティング対応）
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
