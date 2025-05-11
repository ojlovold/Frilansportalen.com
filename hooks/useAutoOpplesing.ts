import { useEffect } from "react";

export default function useAutoOpplesing() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const handler = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!el || typeof window.lesTekst !== "function") return;

      const tekst =
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        el.textContent?.trim();

      if (tekst && tekst.length > 0) {
        window.lesTekst(tekst);
      }
    };

    const events = ["mouseenter", "focus", "touchstart", "keydown"];

    const keyboardHandler = (e: KeyboardEvent) => {
      if (["Enter", " "].includes(e.key)) handler(e);
    };

    document.addEventListener("mouseenter", handler, true);
    document.addEventListener("focus", handler, true);
    document.addEventListener("touchstart", handler, true);
    document.addEventListener("keydown", keyboardHandler, true);

    return () => {
      document.removeEventListener("mouseenter", handler, true);
      document.removeEventListener("focus", handler, true);
      document.removeEventListener("touchstart", handler, true);
      document.removeEventListener("keydown", keyboardHandler, true);
    };
  }, []);
}
