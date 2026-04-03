export default function BuyMeACoffeeLink() {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <a
        href="https://www.buymeacoffee.com/nacodea"
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-2
          rounded-full
          bg-yellow-300
          px-4 py-3
          text-sm font-semibold text-black
          shadow-lg
          hover:bg-yellow-400
          transition
        "
      >
        ☕ 応援する
      </a>
    </div>
  );
}
