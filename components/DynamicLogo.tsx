// components/DynamicLogo.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function DynamicLogo({ className = "w-auto h-16" }: { className?: string }) {
  const [src, setSrc] = useState("/logos/logo_frilansportalen_white.png");

  useEffect(() => {
    const språk = navigator.language?.slice(0, 2) || "nb";
    const skandinavisk = ["nb", "no", "nn", "sv", "da"];
    const fil = skandinavisk.includes(språk)
      ? "/logos/logo_frilansportalen_white.png"
      : "/logos/logo_the_freelance_portal_white.png";
    setSrc(fil);
  }, []);

  return (
    <Image
      src={src}
      alt="Logo"
      width={320}
      height={80}
      className={className}
      priority
    />
  );
}
