// components/Oversetter.tsx
import { useEffect } from "react";
import { translateTekst } from "@/lib/translate";

export function AutoOversett() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const språk = localStorage.getItem("sprak") || "no";
    const oversettAlt = async () => {
      const rot = document.querySelector("main");
      if (!rot) return;

      const walker = document.createTreeWalker(rot, NodeFilter.SHOW_TEXT);
      const unike = new Map<string, Text[]>();

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const tekst = node.textContent?.trim();
        if (!tekst || tekst.length < 2) continue;
        if (!unike.has(tekst)) unike.set(tekst, []);
        unike.get(tekst)!.push(node);
      }

      for (const [tekst, noder] of unike.entries()) {
        const oversatt = await translateTekst(tekst, språk);
        if (oversatt && oversatt !== tekst) {
          for (const n of noder) n.textContent = oversatt;
        }
      }
    };

    setTimeout(oversettAlt, 100);
  }, []);

  return null;
}
