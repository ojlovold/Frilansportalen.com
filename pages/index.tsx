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
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white px-6 py-12 font-sans relative overflow-hidden">
      {/* Visuell bakgrunnseffekt */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)] z-0"></div>

      {/* Logo og heading */}
      <div className="relative z-10 text-center mb-10">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen"
          width={64}
          height={64}
          priority
          className="mx-auto mb-4 drop-shadow-md"
        />
        <h1 className="text-4xl font-extrabold drop-shadow-md text-white tracking-wide uppercase">
          Frilansportalen
        </h1>
        <p className="mt-3 text-lg font-medium max-w-lg mx-auto text-white/90">
          Her starter samarbeidet som forandrer hverdagen — for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
        </p>
      </div>

      {/* Rutenett med kort */}
      <section className="relative z-10 max-w-md mx-auto grid grid-cols-2 gap-4">
        {knapper.map(({ href, label, icon }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/25 backdrop-blur-2xl text-white px-4 py-6 rounded-3xl flex flex-col items-center justify-center text-sm font-semibold shadow-2xl hover:scale-[1.03] transition-transform border border-white/10">
              <div className="mb-2 text-xl">{icon}</div>
              {label}
            </a>
          </Link>
        ))}
      </section>

      {/* Kom i gang-knapp */}
      <div className="relative z-10 text-center mt-14">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-gradient-to-r from-[#8A4FFF] to-[#C97BFF] text-white font-bold px-10 py-3 rounded-full shadow-xl hover:brightness-110 transition-transform">
            Kom i gang
          </a>
        </Link>
      </div>
    </main>
  );
}
