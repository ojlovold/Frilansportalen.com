// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { Globe, Volume2, LogIn, Briefcase, User, Search, Hammer, Store, HeartHandshake } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black flex flex-col items-center justify-start p-6">
      {/* Logo */}
      <Image
        src="/frilansportalen_logo.jpeg"
        alt="Frilansportalen logo"
        width={300}
        height={100}
        className="mb-8 mt-6"
      />

      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Globe className="cursor-pointer" title="Velg språk" />
        <Volume2 className="cursor-pointer" title="Tekst til tale" />
        <LogIn className="cursor-pointer" title="Logg inn" />
      </div>

      {/* Bokser */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/arbeidsgiver" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <Briefcase className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Arbeidsgiver</span>
        </Link>
        <Link href="/frilanser" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <User className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Frilanser</span>
        </Link>
        <Link href="/jobbsoker" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <Search className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Jobbsøker</span>
        </Link>
        <Link href="/tjenestetilbyder" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <Hammer className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Tjenestetilbyder</span>
        </Link>
        <Link href="/markeder" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <Store className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Markeder</span>
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-200 p-6 rounded-2xl shadow text-center hover:bg-gray-300">
          <HeartHandshake className="mx-auto mb-2" />
          <span className="text-lg font-semibold">Dugnadsportalen</span>
        </Link>
      </div>
    </main>
  );
}
