import Image from "next/image";
import Link from "next/link";
import { Briefcase, User, Search, Hammer, Store, Users, Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6 relative">
      {/* Øverste høyre ikoner */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Globe className="cursor-pointer" aria-label="Velg språk" />
        <Volume2 className="cursor-pointer" aria-label="Tekst til tale" />
        <LogIn className="cursor-pointer" aria-label="Logg inn" />
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-10 mb-4">
        <Image
          src="/Frilansportalen_logo_skarp_optimized.jpeg"
          alt="Frilansportalen-logo"
          width={400}
          height={100}
        />
      </div>

      {/* Velkomsttekst */}
      <p className="text-center text-lg mb-10">
        Velkommen til Frilansportalen – Norges smarteste plattform for frilansere, arbeidsgivere og privatpersoner.
      </p>

      {/* Navigasjonsbokser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link href="/arbeidsgiver" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Briefcase size={32} /> <span className="text-lg font-semibold">Arbeidsgiver</span>
        </Link>
        <Link href="/frilanser" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <User size={32} /> <span className="text-lg font-semibold">Frilanser</span>
        </Link>
        <Link href="/jobbsoker" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Search size={32} /> <span className="text-lg font-semibold">Jobbsøker</span>
        </Link>
        <Link href="/tjenestetilbyder" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Hammer size={32} /> <span className="text-lg font-semibold">Tjenestetilbyder</span>
        </Link>
        <Link href="/markeder" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Store size={32} /> <span className="text-lg font-semibold">Markeder</span>
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Users size={32} /> <span className="text-lg font-semibold">Dugnadsportalen</span>
        </Link>
      </div>
    </main>
  );
}
