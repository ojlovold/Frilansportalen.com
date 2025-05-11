import { useEffect } from "react";

export default function useAutoOpplesing() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!window.lesTekst || !target) return;

      const tekst =
        target.getAttribute("aria-label") ||
        target.getAttribute("title") ||
        target.textContent?.trim();

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
