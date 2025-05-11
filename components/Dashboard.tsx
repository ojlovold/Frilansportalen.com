import Link from "next/link";
import { ReactNode } from "react";

export default function Dashboard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidepanel */}
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <h1 className="text-2xl font-bold">Frilansportalen</h1>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-yellow-100 rounded">
            Dashboard
          </Link>
          <Link href="/profil" className="block px-4 py-2 hover:bg-yellow-100 rounded">
            Min profil
          </Link>
          <Link href="/dokumenter" className="block px-4 py-2 hover:bg-yellow-100 rounded">
            Mine dokumenter
          </Link>
          <Link href="/fakturainnstillinger" className="block px-4 py-2 hover:bg-yellow-100 rounded">
            Fakturainnstillinger
          </Link>
        </nav>
      </aside>

      {/* Innholdsområde */}
      <main className="flex-1 bg-portalGul text-black p-6">
        {children}
      </main>
    </div>
  );
}
