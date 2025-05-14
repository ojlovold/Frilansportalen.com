import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  User,
  Search,
  Hammer,
  Store,
  HeartHandshake,
  Globe,
  Volume2,
  LogIn
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-portalGul text-black">
      <header className="flex justify-between items-center p-4">
        <Image src="/Frilansportalen_logo_skarp.jpeg" alt="Logo" width={200} height={60} />
        <div className="flex gap-4">
          <Globe className="cursor-pointer" title="Velg språk" />
          <Volume2 className="cursor-pointer" title="Tekst til tale" />
          <LogIn className="cursor-pointer" title="Logg inn" />
        </div>
      </header>

      <main className="flex flex-col items-center justify-center py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link href="/arbeidsgiver">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <Briefcase size={48} />
              <span className="text-lg font-bold mt-4">Arbeidsgiver</span>
            </div>
          </Link>

          <Link href="/frilanser">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <User size={48} />
              <span className="text-lg font-bold mt-4">Frilanser</span>
            </div>
          </Link>

          <Link href="/jobbsoker">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <Search size={48} />
              <span className="text-lg font-bold mt-4">Jobbsøker</span>
            </div>
          </Link>

          <Link href="/tjenestetilbyder">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <Hammer size={48} />
              <span className="text-lg font-bold mt-4">Tjenestetilbyder</span>
            </div>
          </Link>

          <Link href="/markeder">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <Store size={48} />
              <span className="text-lg font-bold mt-4">Markeder</span>
            </div>
          </Link>

          <Link href="/dugnadsportalen">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl">
              <HeartHandshake size={48} />
              <span className="text-lg font-bold mt-4">Dugnadsportalen</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
