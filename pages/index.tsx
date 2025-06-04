"use client";

import Link from "next/link";
import Image from "next/image";
import {
  HardHat, User, Search, Hammer, Store, Globe
} from "lucide-react";

export default function HomePage() {
  const knapper = [
    { href: "/registrer-arbeidsgiver", label: "Arbeidsgiver", icon: <HardHat /> },
    { href: "/frilanser", label: "Frilanser", icon: <User /> },
    { href: "/jobbsoker", label: "Jobbsøker", icon: <Search /> },
    { href: "/tjenestetilbyder", label: "Tjenestetilbyder", icon: <Hammer /> },
    { href: "/dugnadsportalen", label: "Dugnadsportalen", icon: <Hammer /> },
    { href: "/gjenbruksportalen", label: "Gjenbruksportalen", icon: <Store /> },
    { href: "/tips", label: "Tips og triks", icon: <Globe /> },
    { href: "/fagshoppen", label: "Fagshoppen", icon: <Store /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF930F] via-[#FBC400] to-[#FFE29F] text-white px-4 pb-10 pt-12 font-sans relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image src="/logo_flat_white.png" alt="Frilansportalen" width={48} height={48} priority />
        </div>
        <h1 className="text-4xl font-bold drop-shadow-lg uppercase tracking-wide">
          Frilansportalen
        </h1>
        <p className="mt-3 text-lg font-medium max-w-md mx-auto text-white/90">
          Her starter samarbeidet som forandrer hverdagen — for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
        </p>
      </div>

      <section className="max-w-md mx-auto grid grid-cols-2 gap-4">
        {knapper.map(({ href, label, icon }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/20 backdrop-blur-xl text-white px-4 py-6 rounded-2xl flex flex-col items-center justify-center text-sm font-semibold shadow-lg hover:scale-[1.03] transition">
              <div className="mb-2 text-xl">{icon}</div>
              {label}
            </a>
          </Link>
        ))}
      </section>

      <div className="text-center mt-12">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-gradient-to-r from-[#8352FF] to-[#C89AFE] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:brightness-110 transition">
            Kom i gang
          </a>
        </Link>
      </div>
    </main>
  );
}
