// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      {/* Toppkontroller */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <button title="Språkvalg">
          <Globe className="w-6 h-6" />
        </button>
        <button title="Tekst til tale">
          <Volume2 className="w-6 h-6" />
        </button>
        <Link href="/login">
          <LogIn className="w-6 h-6" />
        </Link>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          width={300}
          height={100}
          priority
        />
      </div>

      {/* Valgfri velkomsttekst */}
      <div className="text-center text-lg font-medium mb-8 hidden md:block">
        <p>Velkommen til Frilansportalen – Norges komplette plattform for arbeid, tjenester og samarbeid.</p>
      </div>

      {/* Boksgrid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/arbeidsgiver" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Arbeidsgiver
          </div>
        </Link>
        <Link href="/frilanser" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Frilanser
          </div>
        </Link>
        <Link href="/jobbsoker" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Jobbsøker
          </div>
        </Link>
        <Link href="/tjenester" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Tjenestetilbyder
          </div>
        </Link>
        <Link href="/markeder" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Markeder
          </div>
        </Link>
        <Link href="/dugnadsportalen" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 text-center text-xl font-semibold hover:scale-105 transition-all">
            Dugnadsportalen
          </div>
        </Link>
      </div>
    </main>
  );
}

/*

--- For versjonen uten velkomsttekst ---

Fjern hele dette elementet fra koden:

<div className="text-center text-lg font-medium mb-8 hidden md:block">
  <p>Velkommen til Frilansportalen – Norges komplette plattform for arbeid, tjenester og samarbeid.</p>
</div>

*/
