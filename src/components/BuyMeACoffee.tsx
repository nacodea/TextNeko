"use client";

export function BuyMeACoffee() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "260px",
        height: "100px",
        zIndex: 50,
      }}
    >
      <iframe
        src="https://www.buymeacoffee.com/widget/page/nacodea?description=Support%20me&color=%23FFDD00"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        sandbox="allow-popups allow-scripts allow-same-origin"
        loading="lazy"
        title="Buy Me a Coffee"
      />
    </div>
  );
}
