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
    <main className="min-h-screen bg-gradient-to-br from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white px-4 py-10 font-sans relative overflow-hidden">
      {/* Dekor bakgrunnsmønster */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.07),_transparent_70%)]"></div>
      </div>

      {/* Logo og heading */}
      <div className="relative z-10 text-center mb-10">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen"
          width={120}
          height={120}
          priority
          className="mx-auto mb-4 drop-shadow-xl"
        />
        <h1 className="text-4xl font-extrabold drop-shadow-xl text-white tracking-wide uppercase">
          Frilansportalen
        </h1>
        <p className="mt-4 text-lg font-medium max-w-xl mx-auto text-white/90">
          Her starter samarbeidet som forandrer hverdagen — for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
        </p>
      </div>

      {/* Rutenett med knapper */}
      <section className="relative z-10 max-w-md mx-auto grid grid-cols-2 gap-4">
        {knapper.map(({ href, label, icon }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-4 py-6 rounded-3xl flex flex-col items-center justify-center text-sm font-semibold shadow-2xl border border-white/10 transition-all">
              <div className="mb-2 text-2xl text-white drop-shadow-md">{icon}</div>
              {label}
            </a>
          </Link>
        ))}
      </section>

      {/* CTA-knapp */}
      <div className="relative z-10 text-center mt-12">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-gradient-to-r from-[#7B3EFF] to-[#B983FF] text-white font-bold px-10 py-3 rounded-full shadow-xl hover:scale-[1.02] hover:brightness-110 transition">
            Kom i gang
          </a>
        </Link>
      </div>
    </main>
  );
}
