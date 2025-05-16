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
        <span className="cursor-pointer" title="Velg språk">
          <Globe />
        </span>
        <span className="cursor-pointer" title="Tekst til tale">
          <Volume2 />
        </span>
        <span className="cursor-pointer" title="Logg inn">
          <LogIn />
        </span>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-8 sm:mt-0 mb-8">
        <Image
          src="/logo_transparent.png"
          alt="Frilansportalen logo"
          width={500}
          height={125}
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Velkommen til Frilansportalen</h1>
        <p className="text-lg mt-2">
          Her starter samarbeidet som forandrer hverdagen – for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
        </p>
      </div>

      {/* Navigasjonsbokser */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
        <Link href="/registrer-arbeidsgiver" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Briefcase className="text-2xl" /> Arbeidsgiver
          </a>
        </Link>
        <Link href="/frilanser" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <User className="text-2xl" /> Frilanser
          </a>
        </Link>
        <Link href="/jobbsoker" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Search className="text-2xl" /> Jobbsøker
          </a>
        </Link>
        <Link href="/tjenestetilbyder" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Hammer className="text-2xl" /> Tjenestetilbyder
          </a>
        </Link>
        <Link href="/dugnadsportalen" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Hammer className="text-2xl" /> Dugnadsportalen
          </a>
        </Link>
        <Link href="/gjenbruksportalen" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Store className="text-2xl" /> Gjenbruksportalen
          </a>
        </Link>
        <Link href="/fagshoppen" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
            <Store className="text-2xl" /> Fagshoppen
          </a>
        </Link>
      </div>
    </main>
  );
}
