// components/DynamicLogo.tsx – viser riktig logo etter språkvalg
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function DynamicLogo({ className = "w-auto h-24" }: { className?: string }) {
  const [src, setSrc] = useState("/logo_frilansportalen_white_3d_front.png");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const språk = navigator.language?.slice(0, 2) || "nb";
    const skandinavisk = ["nb", "no", "nn", "sv", "da"];
    const fallback = "/logo_frilansportalen_white_3d_front.png";
    const engelsk = "/logo_the_freelance_portal_white.png";
    setSrc(skandinavisk.includes(språk) ? fallback : engelsk);
  }, []);

  return (
    <Image
      src={src}
      alt="Frilansportalen logo"
      width={320}
      height={80}
      className={className + " mx-auto drop-shadow-xl"}
      priority
    />
  );
}
