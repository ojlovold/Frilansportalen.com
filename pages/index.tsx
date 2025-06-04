"use client";

import BølgeBakgrunn from "@/components/BølgeBakgrunn";
import LogoHeader from "@/components/LogoHeader";
import RolleKort from "@/components/RolleKort";

export default function HomePage() {
  const kort = [
    { href: "/registrer-arbeidsgiver", label: "Arbeidsgiver", icon: "/arbeidsgiver.png" },
    { href: "/frilanser", label: "Frilanser", icon: "/frilanser.png" },
    { href: "/jobbsoker", label: "Jobbsøker", icon: "/lommelykt_gjennomsiktig.png" },
    { href: "/tjenestetilbyder", label: "Tjenestetilbyder", icon: "/hammer_gjennomsiktig.png" },
    { href: "/dugnadsportalen", label: "Dugnadsportalen", icon: "/dugnad.png" },
    { href: "/gjenbruksportalen", label: "Gjenbruksportalen", icon: "/gjenbruk.png" },
    { href: "/tips", label: "Tips og triks", icon: "/tips.png" },
    { href: "/fagshoppen", label: "Fagshoppen", icon: "/fagshop.png" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white px-4 py-10 font-sans relative overflow-hidden">
      <BølgeBakgrunn />
      <LogoHeader />
      <section className="relative z-10 max-w-md mx-auto grid grid-cols-2 gap-4">
        {kort.map((k, i) => (
          <RolleKort key={i} {...k} />
        ))}
      </section>
      <div className="relative z-10 text-center mt-12">
        <a href="/registrer" className="inline-block bg-gradient-to-r from-[#8352FF] to-[#C89AFE] text-white font-bold px-10 py-3 rounded-full shadow-xl hover:scale-[1.02] hover:brightness-110 transition">
          Kom i gang
        </a>
      </div>
    </main>
  );
}
