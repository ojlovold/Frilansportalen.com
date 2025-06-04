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
    <main className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200 text-black p-4 relative overflow-hidden">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4 text-xl">
        <Link href="/login"><LogIn /></Link>
      </div>

      {/* Accessibility knappen flytende nede til høyre */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="bg-white/90 border border-black rounded-xl shadow max-w-xs overflow-hidden">
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium">Tilgjengelighet</summary>
          <AccessibilityPanel tekst={typeof window !== "undefined" ? document.body.innerText : ""} />
        </details>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-8 sm:mt-0 mb-6">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen logo"
          width={320}
          height={80}
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl font-bold drop-shadow-sm">Velkommen til Frilansportalen</h1>
        <p className="text-lg mt-2 text-neutral-800 max-w-xl mx-auto">
          Her starter samarbeidet som forandrer hverdagen – for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
        </p>
      </div>

      {/* Rollevalg */}
      <section className="bg-white/40 backdrop-blur-md rounded-3xl p-6 max-w-2xl mx-auto shadow-md">
        <h2 className="text-xl font-semibold mb-4">Velg rolle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/registrer-arbeidsgiver" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Briefcase /> Arbeidsgiver
            </a>
          </Link>
          <Link href="/frilanser" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <User /> Frilanser
            </a>
          </Link>
          <Link href="/jobbsoker" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Search /> Jobbsøker
            </a>
          </Link>
          <Link href="/tjenestetilbyder" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Hammer /> Tjenestetilbyder
            </a>
          </Link>
        </div>
      </section>

      {/* Utforsk portaler */}
      <section className="bg-white/40 backdrop-blur-md rounded-3xl p-6 max-w-2xl mx-auto mt-10 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Utforsk portaler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dugnadsportalen" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Hammer /> Dugnadsportalen
            </a>
          </Link>
          <Link href="/gjenbruksportalen" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Store /> Gjenbruksportalen
            </a>
          </Link>
          <Link href="/fagshoppen" legacyBehavior>
            <a className="bg-yellow-100 hover:bg-yellow-200 rounded-2xl p-5 flex items-center gap-4 font-medium shadow">
              <Store /> Fagshoppen
            </a>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/registrer" legacyBehavior>
          <a className="inline-block bg-black text-yellow-300 text-lg font-semibold px-6 py-3 rounded-full shadow hover:bg-neutral-900">
            Kom i gang
          </a>
        </Link>
      </div>
    </main>
  );
}
