// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          width={300}
          height={100}
          priority
        />
      </div>

      {/* Kontroller øverst til høyre */}
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

      {/* Knapp-grid */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/arbeidsgiver" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Arbeidsgiver
          </div>
        </Link>
        <Link href="/frilanser" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Frilanser
          </div>
        </Link>
        <Link href="/jobbsoker" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Jobbsøker
          </div>
        </Link>
        <Link href="/tjenester" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Tjenestetilbyder
          </div>
        </Link>
        <Link href="/markeder" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Markeder
          </div>
        </Link>
        <Link href="/dugnadsportalen" className="group">
          <div className="bg-gray-200 rounded-2xl shadow-xl p-6 text-center text-xl font-semibold hover:scale-105 transition-all">
            Dugnadsportalen
          </div>
        </Link>
      </div>
    </main>
  );
}
