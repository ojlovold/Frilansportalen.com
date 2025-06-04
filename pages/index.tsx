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
    <main className="min-h-screen bg-gradient-to-b from-yellow-300 via-yellow-200 to-yellow-100 text-black p-4 relative overflow-hidden font-sans">
      {/* Flytende tilgjengelighetsknapp */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="bg-white/90 border border-black rounded-xl shadow max-w-xs overflow-hidden">
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium">Tilgjengelighet</summary>
          <AccessibilityPanel tekst={typeof window !== "undefined" ? document.body.innerText : ""} />
        </details>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-6 mb-10">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen logo"
          width={260}
          height={80}
          priority
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">Velkommen til Frilansportalen</h1>
        <p className="text-lg mt-3 max-w-2xl mx-auto text-neutral-700">
          For deg som søker jobb, tilbyr tjenester eller ser etter flinke folk.
        </p>
      </div>

      {/* Kortseksjoner med glass-effekt og hover-animasjon */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {[ 
          { href: "/registrer-arbeidsgiver", icon: <Briefcase />, label: "Arbeidsgiver" },
          { href: "/frilanser", icon: <User />, label: "Frilanser" },
          { href: "/jobbsoker", icon: <Search />, label: "Jobbsøker" },
          { href: "/tjenestetilbyder", icon: <Hammer />, label: "Tjenestetilbyder" },
        ].map(({ href, icon, label }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex items-center gap-4 text-lg hover:scale-[1.03] hover:shadow-2xl transition-transform">
              <span className="text-yellow-600 text-2xl">{icon}</span> {label}
            </a>
          </Link>
        ))}
      </section>

      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {[ 
          { href: "/dugnadsportalen", icon: <Hammer />, label: "Dugnadsportalen" },
          { href: "/gjenbruksportalen", icon: <Store />, label: "Gjenbruksportalen" },
          { href: "/fagshoppen", icon: <Store />, label: "Fagshoppen" },
        ].map(({ href, icon, label }, i) => (
          <Link key={i} href={href} legacyBehavior>
            <a className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex items-center gap-4 text-lg hover:scale-[1.03] hover:shadow-2xl transition-transform">
              <span className="text-yellow-600 text-2xl">{icon}</span> {label}
            </a>
          </Link>
        ))}
      </section>

      {/* CTA-knapp */}
      <div className="text-center">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-black text-yellow-300 text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-neutral-800 transition">
            Kom i gang
          </a>
        </Link>
      </div>

      {/* Innloggingsikon */}
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
