import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="md:hidden fixed bottom-5 right-4 z-50 rounded-full border border-neutral-700/80 bg-neutral-900/90 px-3 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur"
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}
