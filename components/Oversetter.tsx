// components/Oversetter.tsx
import { useEffect } from "react";
import { translateTekst } from "@/lib/translate";

export function AutoOversett() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const språk = localStorage.getItem("sprak") || "no";
    const oversettAlt = async () => {
      const noder = document.querySelectorAll("body *");
      const tekster: string[] = [];

      noder.forEach((el) => {
        if (
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE &&
          el.textContent?.trim()
        ) {
          tekster.push(el.textContent.trim());
        }
      });

      const unike = [...new Set(tekster)];
      const oversatte = await Promise.all(
        unike.map((t) => translateTekst(t, språk))
      );

      const oversettMap = new Map(unike.map((t, i) => [t, oversatte[i]]));

      noder.forEach((el) => {
        if (
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          const opprinnelig = el.textContent?.trim() || "";
          const ny = oversettMap.get(opprinnelig);
          if (ny && ny !== opprinnelig) el.textContent = ny;
        }
      });
    };

    // Bruk idle-tid for å sikre popupene fungerer først
    window.requestIdleCallback(oversettAlt, { timeout: 3000 });
  }, []);

  return null;
}
