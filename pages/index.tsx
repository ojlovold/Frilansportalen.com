// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { Briefcase, User, Search, Hammer, Store, Handshake, Globe, Volume2, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black relative">
      {/* Toppmeny */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Link href="/login">
          <LogIn className="w-6 h-6 hover:scale-110 transition" />
        </Link>
        <Globe className="w-6 h-6 hover:scale-110 transition" />
        <Volume2 className="w-6 h-6 hover:scale-110 transition" />
      </div>

      {/* Logo */}
      <div className="flex justify-center py-10">
        <Image
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          width={300}
          height={80}
        />
      </div>

      {/* Boksrutenett */}
      <div className="grid grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
        <Link href="/arbeidsgiver">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <Briefcase className="w-8 h-8" />
            <span className="text-lg font-semibold">Arbeidsgiver</span>
          </div>
        </Link>

        <Link href="/frilanser">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <User className="w-8 h-8" />
            <span className="text-lg font-semibold">Frilanser</span>
          </div>
        </Link>

        <Link href="/jobbsoker">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <Search className="w-8 h-8" />
            <span className="text-lg font-semibold">Jobbsøker</span>
          </div>
        </Link>

        <Link href="/tjenestetilbyder">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <Hammer className="w-8 h-8" />
            <span className="text-lg font-semibold">Tjenestetilbyder</span>
          </div>
        </Link>

        <Link href="/markeder">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <Store className="w-8 h-8" />
            <span className="text-lg font-semibold">Markeder</span>
          </div>
        </Link>

        <Link href="/dugnadsportalen">
          <div className="bg-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center gap-3">
            <Handshake className="w-8 h-8" />
            <span className="text-lg font-semibold">Dugnadsportalen</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
