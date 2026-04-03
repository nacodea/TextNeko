"use client";

import Script from "next/script";

export function BuyMeACoffeeModal() {
  return (
    <Script
      src="https://cdn.buymeacoffee.com/1/widget.prod.min.js"
      strategy="afterInteractive"
      data-name="BMC-Widget"
      data-id="nacodea"
      data-description="Support me"
      data-message="もしTextNekoが役に立ったら☕"
      data-color="#FFDD00"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
    />
  );
}
