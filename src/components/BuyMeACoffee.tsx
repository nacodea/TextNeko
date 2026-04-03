export default function BuyMeACoffeeLink() {
  return (
    <div className="fixed right-4 bottom-4 z-50 hidden md:block">
      <a
        href="https://www.buymeacoffee.com/nacodea"
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-1
          rounded-full bg-yellow-300 px-2 py-1
          shadow-md
          transition-all duration-200
          hover:-translate-y-1 hover:shadow-lg
          active:translate-y-0
        "
      >
        <img
          src="/coffee.png"
          alt="Buy me a coffee"
          className="h-10 w-10 drop-shadow-[0_0_1px_rgba(0,0,0,0.6)]"
        />

        <span className="hidden sm:inline text-sm font-semibold text-black mr-4">
          応援する
        </span>
      </a>
    </div>
  );
}
