import Image from "next/image";
import Link from "next/link";
import { Globe, Volume2, LogIn, Briefcase, User, Search, Store, Users, HeartHandshake } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black relative">
      {/* Topp-ikoner */}
      <div className="absolute top-4 right-6 flex gap-4">
        <Link href="/language"><Globe className="w-6 h-6 hover:text-gray-700" /></Link>
        <button><Volume2 className="w-6 h-6 hover:text-gray-700" /></button>
        <Link href="/login"><LogIn className="w-6 h-6 hover:text-gray-700" /></Link>
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-12">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          width={300}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Velkomsttekst */}
      <div className="text-center mt-6 mb-10 text-lg">
        Velkommen til Frilansportalen – Norges smarteste plattform for arbeid og tjenester.
      </div>

      {/* Boksrutenett */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 pb-16">
        <Link href="/arbeidsgiver" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Arbeidsgiver</p>
          </div>
        </Link>
        <Link href="/frilanser" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <User className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Frilanser</p>
          </div>
        </Link>
        <Link href="/jobbsoker" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <Search className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Jobbsøker</p>
          </div>
        </Link>
        <Link href="/tjenestetilbyder" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Tjenestetilbyder</p>
          </div>
        </Link>
        <Link href="/markeder" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <Store className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Markeder</p>
          </div>
        </Link>
        <Link href="/dugnadsportalen" className="group">
          <div className="bg-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all text-center">
            <HeartHandshake className="w-10 h-10 mx-auto mb-2 text-gray-700 group-hover:text-black" />
            <p className="text-lg font-semibold">Dugnadsportalen</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
