"use client";

import Script from "next/script";

export function BuyMeACoffeeModal() {
  return (
    <Script
      src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
      strategy="afterInteractive" // ページ描画後に読み込み
      data-name="bmc-button"
      data-slug="nacodea" // ←自分のユーザー名に変更
      data-color="#FFDD00"
      data-emoji="☕"
      data-font="Cookie"
      data-text="もしTextNekoが役に立ったら☕"
      data-outline-color="#000000"
      data-font-color="#000000"
      data-coffee-color="#ffffff"
    />
  );
}
