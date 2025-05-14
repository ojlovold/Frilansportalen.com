// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { Briefcase, User, Search, Hammer, Store, Heart, Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4 text-xl">
        <span className="cursor-pointer" title="Velg språk"><Globe /></span>
        <span className="cursor-pointer" title="Tekst til tale"><Volume2 /></span>
        <span className="cursor-pointer" title="Logg inn"><LogIn /></span>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4 mt-6">
        <Image
          src="/IMG_6629.jpeg"
          alt="Frilansportalen logo"
          width={400}
          height={100}
        />
      </div>

      {/* Velkomsttekst */}
      <h1 className="text-center text-2xl font-bold mb-6">Velkommen til Frilansportalen</h1>

      {/* Knappene */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
        <Link href="/arbeidsgiver" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <Briefcase /> Arbeidsgiver
        </Link>
        <Link href="/frilanser" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <User /> Frilanser
        </Link>
        <Link href="/jobbsoker" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <Search /> Jobbsøker
        </Link>
        <Link href="/tjenestetilbyder" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <Hammer /> Tjenestetilbyder
        </Link>
        <Link href="/markeder" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <Store /> Markeder
        </Link>
        <Link href="/dugnadsportalen" className="bg-gray-100 rounded-2xl p-4 shadow-md hover:shadow-lg flex items-center gap-4 text-lg">
          <Heart /> Dugnadsportalen
        </Link>
      </div>
    </main>
  );
}
