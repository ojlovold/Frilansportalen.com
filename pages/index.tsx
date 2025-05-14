import Image from "next/image";
import Link from "next/link";
import { Briefcase, User, Search, Hammer, Store, HeartHandshake, Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Globe className="cursor-pointer" title="Velg språk" />
        <Volume2 className="cursor-pointer" title="Tekst til tale" />
        <LogIn className="cursor-pointer" title="Logg inn" />
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image src="/frilansportalen_logo.jpeg" alt="Frilansportalen logo" width={300} height={100} />
      </div>

      {/* Boksene */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/arbeidsgiver" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <Briefcase className="w-8 h-8" />
          <span className="text-xl font-semibold">Arbeidsgiver</span>
        </Link>
        <Link href="/frilanser" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <User className="w-8 h-8" />
          <span className="text-xl font-semibold">Frilanser</span>
        </Link>
        <Link href="/jobbsoker" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <Search className="w-8 h-8" />
          <span className="text-xl font-semibold">Jobbsøker</span>
        </Link>
        <Link href="/tjenestetilbyder" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <Hammer className="w-8 h-8" />
          <span className="text-xl font-semibold">Tjenestetilbyder</span>
        </Link>
        <Link href="/markeder" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <Store className="w-8 h-8" />
          <span className="text-xl font-semibold">Markeder</span>
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-100 shadow-md rounded-xl p-6 flex items-center gap-4 hover:bg-gray-200">
          <HeartHandshake className="w-8 h-8" />
          <span className="text-xl font-semibold">Dugnadsportalen</span>
        </Link>
      </div>
    </main>
  );
}
