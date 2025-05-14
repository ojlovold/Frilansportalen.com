// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  User,
  Search,
  Hammer,
  Store,
  Users,
  Globe,
  Volume2,
  LogIn
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 flex flex-col items-center justify-center p-6">
      {/* Topp: Logo og ikoner */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen Logo"
          width={250}
          height={80}
          priority
        />
        <div className="flex gap-4">
          <div title="Velg språk">
            <Globe className="cursor-pointer" />
          </div>
          <div title="Tekst til tale">
            <Volume2 className="cursor-pointer" />
          </div>
          <div title="Logg inn">
            <LogIn className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Velkomsttekst */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Velkommen til Frilansportalen – din komplette plattform for arbeid og tjenester
      </h1>

      {/* Seksjon med 6 bokser */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <Link href="/arbeidsgiver" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <Briefcase className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Arbeidsgiver</h2>
        </Link>
        <Link href="/frilanser" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <User className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Frilanser</h2>
        </Link>
        <Link href="/jobbsoker" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <Search className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Jobbsøker</h2>
        </Link>
        <Link href="/tjenestetilbyder" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <Hammer className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Tjenestetilbyder</h2>
        </Link>
        <Link href="/markeder" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <Store className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Markeder</h2>
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:scale-105 transition text-center">
          <Users className="mx-auto mb-2" size={32} />
          <h2 className="text-lg font-semibold">Dugnadsportalen</h2>
        </Link>
      </div>
    </main>
  );
}
