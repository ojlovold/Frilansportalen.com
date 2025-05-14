import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  User,
  Search,
  Hammer,
  Store,
  Globe,
  Volume2,
  LogIn,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4 text-xl">
        <span className="cursor-pointer" title="Velg språk">🌐</span>
        <span className="cursor-pointer" title="Tekst til tale">🔊</span>
        <span className="cursor-pointer" title="Logg inn">🔐</span>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          width={300}
          height={60}
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Velkommen til Frilansportalen</h1>
        <p className="text-lg">\          Finn frilansere, jobbmuligheter, tjenester og mer – alt samlet på ett sted.
        </p>
      </div>

      {/* Seksjoner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link href="/arbeidsgiver" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <Briefcase className="text-2xl" /> Arbeidsgiver
          </a>
        </Link>
        <Link href="/frilanser" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <User className="text-2xl" /> Frilanser
          </a>
        </Link>
        <Link href="/jobbsoker" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <Search className="text-2xl" /> Jobbsøker
          </a>
        </Link>
        <Link href="/tjenestetilbyder" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <Hammer className="text-2xl" /> Tjenestetilbyder
          </a>
        </Link>
        <Link href="/markeder" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <Store className="text-2xl" /> Markeder
          </a>
        </Link>
        <Link href="/dugnadsportalen" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <Globe className="text-2xl" /> Dugnadsportalen
          </a>
        </Link>
      </div>
    </main>
  );
}
