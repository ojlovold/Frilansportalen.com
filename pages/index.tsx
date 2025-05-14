import Image from "next/image";
import Link from "next/link";
import { Briefcase, User, Search, Hammer, Store, Users, Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="relative group">
          <Globe className="cursor-pointer" aria-label="Velg språk" />
          <span className="absolute text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition top-6 right-0 z-10">
            Velg språk
          </span>
        </div>
        <div className="relative group">
          <Volume2 className="cursor-pointer" aria-label="Tekst til tale" />
          <span className="absolute text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition top-6 right-0 z-10">
            Tekst til tale
          </span>
        </div>
        <div className="relative group">
          <LogIn className="cursor-pointer" aria-label="Logg inn" />
          <span className="absolute text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition top-6 right-0 z-10">
            Logg inn
          </span>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Logo"
          width={260}
          height={80}
        />
      </div>

      {/* Seksjonsbokser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link href="/arbeidsgiver" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <Briefcase className="w-8 h-8" />
          <span className="text-xl font-bold">Arbeidsgiver</span>
        </Link>
        <Link href="/frilanser" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <User className="w-8 h-8" />
          <span className="text-xl font-bold">Frilanser</span>
        </Link>
        <Link href="/jobbsoker" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <Search className="w-8 h-8" />
          <span className="text-xl font-bold">Jobbsøker</span>
        </Link>
        <Link href="/tjenester" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <Hammer className="w-8 h-8" />
          <span className="text-xl font-bold">Tjenestetilbyder</span>
        </Link>
        <Link href="/markeder" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <Store className="w-8 h-8" />
          <span className="text-xl font-bold">Markeder</span>
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-200 rounded-xl shadow-md p-8 hover:shadow-lg flex items-center gap-4">
          <Users className="w-8 h-8" />
          <span className="text-xl font-bold">Dugnadsportalen</span>
        </Link>
      </div>
    </main>
  );
}
