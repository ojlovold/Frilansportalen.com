// components/AutoOversettSafe.tsx
import { useEffect } from "react";
import { translateTekst } from "@/lib/translate";

export default function AutoOversettSafe() {
  useEffect(() => {
    const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";

    if (typeof window === "undefined" || språk === "no") return;

    const oversettAlt = async () => {
      const tekstnoder: Node[] = [];

      const gåGjennom = (node: Node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent?.trim() &&
          node.parentElement?.tagName !== "SCRIPT" &&
          node.parentElement?.tagName !== "STYLE"
        ) {
          tekstnoder.push(node);
        }
        node.childNodes.forEach(gåGjennom);
      };

      gåGjennom(document.body);

      for (const node of tekstnoder) {
        const original = node.textContent!;
        try {
          const oversatt = await translateTekst(original, språk);
          if (original === node.textContent) {
            node.textContent = oversatt;
          }
        } catch {
          // Ignorer feil – vis originaltekst
        }
      }
    };

    oversettAlt();
  }, []);

  return null;
}
