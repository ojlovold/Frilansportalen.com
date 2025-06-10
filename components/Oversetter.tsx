// components/Oversetter.tsx
import { useEffect } from "react";
import { translateTekst } from "@/lib/translate";

function hentTekstnoder(node: Node): Text[] {
  const tekstnoder: Text[] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      if (!n.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      if (n.parentElement?.tagName === "SCRIPT") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current: Node | null;
  while ((current = walker.nextNode())) {
    tekstnoder.push(current as Text);
  }
  return tekstnoder;
}

export function AutoOversett() {
  useEffect(() => {
    const språk = localStorage.getItem("sprak") || "no";
    if (språk === "no") return;

    const oversatt = new WeakSet<Node>();

    async function oversettAlt(node: Node) {
      const noder = hentTekstnoder(node);
      for (const tekstnode of noder) {
        if (oversatt.has(tekstnode)) continue;
        const original = tekstnode.textContent || "";
        const nyTekst = await translateTekst(original, språk);
        if (nyTekst && nyTekst !== original) {
          tekstnode.textContent = nyTekst;
          oversatt.add(tekstnode);
        }
      }
    }

    const observer = new MutationObserver((mutasjoner) => {
      for (const mut of mutasjoner) {
        for (const node of mut.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            oversettAlt(node);
          }
        }
      }
    });

    oversettAlt(document.body);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
