"use client";

import BølgeBakgrunn from "@/components/BølgeBakgrunn";
import LogoHeader from "@/components/LogoHeader";
import RolleKort from "@/components/RolleKort";
import {
  HardHat, User, Search, Hammer, Store, Globe
} from "lucide-react";

export default function HomePage() {
  const kort = [
    { href: "/registrer-arbeidsgiver", label: "Arbeidsgiver", icon: <HardHat />, color: "#FF9130" },
    { href: "/frilanser", label: "Frilanser", icon: <User />, color: "#FF5C8D" },
    { href: "/jobbsoker", label: "Jobbsøker", icon: <Search />, color: "#4BA3FF" },
    { href: "/tjenestetilbyder", label: "Tjenestetilbyder", icon: <Hammer />, color: "#24C486" },
    { href: "/dugnadsportalen", label: "Dugnadsportalen", icon: <Hammer />, color: "#FFD93D" },
    { href: "/gjenbruksportalen", label: "Gjenbruksportalen", icon: <Store />, color: "#FF6F61" },
    { href: "/tips", label: "Tips og triks", icon: <Globe />, color: "#8A79FF" },
    { href: "/fagshoppen", label: "Fagshoppen", icon: <Store />, color: "#F26D85" },
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
