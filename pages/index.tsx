import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  User,
  Search,
  Hammer,
  Store,
  LogIn,
} from "lucide-react";

import AccessibilityPanel from "@/components/AccessibilityPanel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-50 text-black relative overflow-hidden">
      {/* Dekor-bakgrunn (prikker eller bølger) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-300 via-yellow-100 to-transparent opacity-20"></div>
      </div>

      {/* Flytende tilgjengelighetsknapp */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="bg-white/90 border border-black rounded-xl shadow max-w-xs overflow-hidden">
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium">Tilgjengelighet</summary>
          <AccessibilityPanel tekst={typeof window !== "undefined" ? document.body.innerText : ""} />
        </details>
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-10 pb-6">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen logo"
          width={240}
          height={80}
          priority
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-800 drop-shadow-lg">
          Hva vil du gjøre i dag?
        </h1>
        <p className="text-md mt-3 max-w-xl mx-auto text-neutral-700">
          Start samarbeid, utforsk tjenester eller bygg karriere med ett klikk.
        </p>
      </div>

      {/* Kortseksjon med glassmorfisme og dybde */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        {[ 
          { href: "/registrer-arbeidsgiver", icon: <Briefcase />, label: "Arbeidsgiver" },
          { href: "/frilanser", icon: <User />, label: "Frilanser" },
          { href: "/jobbsoker", icon: <Search />, label: "Jobbsøker" },
          { href: "/tjenestetilbyder", icon: <Hammer />, label: "Tjenestetilbyder" },
          { href: "/dugnadsportalen", icon: <Hammer />, label: "Dugnadsportalen" },
          { href: "/gjenbruksportalen", icon: <Store />, label: "Gjenbruksportalen" },
          { href: "/fagshoppen", icon: <Store />, label: "Fagshoppen" },
        ].map(({ href, icon, label }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 flex items-center gap-4 text-lg font-semibold shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-transform border border-yellow-200">
              <span className="text-yellow-600 text-2xl">{icon}</span>
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </section>

      {/* CTA-knapp */}
      <div className="text-center mt-16">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-lg font-bold px-8 py-3 rounded-full shadow-xl hover:brightness-110 transition">
            Kom i gang
          </a>
        </Link>
      </div>

      {/* Login ikon */}
      <div className="absolute top-4 right-4">
        <Link href="/login" legacyBehavior>
          <a className="text-black hover:text-yellow-700">
            <LogIn className="w-6 h-6" />
          </a>
        </Link>
      </div>
    </main>
  );
}
