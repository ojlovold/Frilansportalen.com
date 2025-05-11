import { useEffect } from "react";

export default function useAutoOpplesing() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const lesTekst = (tekst: string) => {
      if (!window.lesTekst || !tekst) return;
      const u = new SpeechSynthesisUtterance(tekst);
      u.lang = "no-NO"; // eller dynamisk fra bar
      window.speechSynthesis.speak(u);
    };

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

    document.addEventListener("mouseenter", handler, true);
    document.addEventListener("focus", handler, true);

    return () => {
      document.removeEventListener("mouseenter", handler, true);
      document.removeEventListener("focus", handler, true);
    };
  }, []);
}
