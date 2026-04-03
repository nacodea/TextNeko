"use client";

import { useEffect } from "react";

export function BuyMeACoffeeModal() {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js",
    );
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-id", "nacodea");
    script.setAttribute("data-description", "Support me!");
    script.setAttribute("data-message", "もしTextNekoが役に立ったら☕");
    script.setAttribute("data-color", "#FFDD00");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
