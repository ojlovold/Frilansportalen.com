// pages/registrer.tsx – med TilbakeKnapp i logostil
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import BølgeBakgrunn from "@/components/BølgeBakgrunn";
import LogoHeader from "@/components/LogoHeader";
import RolleKort from "@/components/RolleKort";
import TilbakeKnapp from "@/components/TilbakeKnapp";

export default function Registrer() {
  const router = useRouter();
  const [valgteRoller, setValgteRoller] = useState<string[]>([]);

  const roller = [
    { label: "Arbeidsgiver", icon: "/arbeidsgiver.png", href: "arbeidsgiver" },
    { label: "Frilanser", icon: "/frilanser.png", href: "frilanser" },
    { label: "Jobbsøker", icon: "/lommelykt_gjennomsiktig.png", href: "jobbsoker" },
    { label: "Tjenestetilbyder", icon: "/hammer_gjennomsiktig.png", href: "tjenestetilbyder" },
  ];

  const toggleRolle = (rolle: string) => {
    setValgteRoller((prev) =>
      prev.includes(rolle)
        ? prev.filter((r) => r !== rolle)
        : [...prev, rolle]
    );
  };

  const handleNeste = () => {
    if (valgteRoller.length === 0) return;
    router.push("/fullfor-registrering?roller=" + valgteRoller.join(","));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white px-4 py-10 font-sans relative overflow-hidden">
      <BølgeBakgrunn />

      {/* 🔁 Tilbake-knapp i visuell 3D-stil */}
      <TilbakeKnapp retning="venstre" className="absolute top-4 left-4 z-50 w-12 h-12" />

      <LogoHeader />

      <div className="relative z-10 max-w-xl mx-auto text-center mt-4 mb-8">
        <h2 className="text-xl font-medium drop-shadow-xl">
          Hva vil du bruke Frilansportalen til?
        </h2>
        <p className="text-sm text-white/90 mt-1">
          Du kan velge flere roller.
        </p>
      </div>

      <section className="relative z-10 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roller.map((r) => (
          <button
            key={r.href}
            onClick={() => toggleRolle(r.href)}
            className={`bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] px-6 py-4 rounded-[22px] flex items-center justify-start text-base font-medium text-white shadow-[6px_8px_18px_rgba(0,0,0,0.4)] border hover:scale-[1.02] transition gap-4 text-left ${
              valgteRoller.includes(r.href)
                ? "border-yellow-400"
                : "border-white/20"
            }`}
          >
            <img
              src={r.icon}
              alt={r.label}
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
            <span className="leading-tight break-keep whitespace-normal">
              {r.label}
            </span>
          </button>
        ))}
      </section>

      <div className="relative z-10 text-center mt-12">
        <button
          onClick={handleNeste}
          className="inline-block bg-gradient-to-r from-[#8352FF] to-[#C89AFE] text-white font-bold px-10 py-3 rounded-full shadow-xl hover:scale-[1.02] hover:brightness-110 transition disabled:opacity-40"
          disabled={valgteRoller.length === 0}
        >
          Neste
        </button>
      </div>
    </main>
  );
}
