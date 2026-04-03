"use client";

import { useEffect } from "react";

export default function BuyMeACoffeeWidget() {
  useEffect(() => {
    // すでに追加されていたら二重登録しない
    if (document.getElementById("bmc-widget")) return;

    const script = document.createElement("script");

    script.id = "bmc-widget";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.async = true;

    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-id", "nacodea");
    script.setAttribute(
      "data-description",
      "このツールが役に立ったら応援してもらえると嬉しいです ☕",
    );
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-color", "#5F7FFF");

    document.body.appendChild(script);
  }, []);

  return null;
}
