// pages/index.tsx
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
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/frilansportalen_logo.jpeg"
          alt="Logo"
          width={300}
          height={100}
          priority
        />
      </div>

      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4">
        <span title="Velg språk">
          <Globe className="cursor-pointer" />
        </span>
        <span title="Tekst til tale">
          <Volume2 className="cursor-pointer" />
        </span>
        <span title="Logg inn">
          <LogIn className="cursor-pointer" />
        </span>
      </div>

      {/* Seksjoner */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link
          href="/arbeidsgiver"
          className="bg-gray-200 hover:bg-gray-300 text-black p-6 rounded-xl shadow flex flex-col items-center justify-center"
        >
          <Briefcase className="w-8 h-8 mb-2" />
          <span>Arbeidsgiver</span>
        </Link>

        <Link
          href="/frilanser"
          className="bg-gray-200 hover:bg-gray-300 text-black p-6 rounded-xl shadow flex flex-col items-center justify-center"
        >
          <User className="w-8 h-8 mb-2" />
          <span>Frilanser</span>
        </Link>

        <Link
          href="/jobbsoker"
          className="bg-gray-200 hover:bg-gray-300 text-black p-6 rounded-xl shadow flex flex-col items-center justify-center"
        >
          <Search className="w-8 h-8 mb-2" />
          <span>Jobbsøker</span>
        </Link>

        <Link
          href="/tjenestetilbyder"
          className="bg-gray-200 hover:bg-gray-300 text-black p-6 rounded-xl shadow flex flex-col items-center justify-center"
        >
          <Hammer className="w-8 h-8 mb-2" />
          <span>Tjenestetilbyder</span>
        </Link>

        <Link
          href="/markeder"
          className="bg-gray-200 hover:bg-gray-300 text-black p-6 rounded-xl shadow flex flex-col items-center justify-center"
        >
          <Store className="w-8 h-8 mb-2" />
          <span>Markeder</span>
        </Link>

        <Link
          href="/dugnadsportalen"
          className="bg
