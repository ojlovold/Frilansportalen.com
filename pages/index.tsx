import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-4 relative">
      {/* Ikoner oppe til høyre */}
      <div className="absolute top-4 right-4 flex gap-4 text-xl">
        <span className="cursor-pointer" title="Velg språk">🌐</span>
        <span className="cursor-pointer" title="Tekst til tale">🔊</span>
        <span className="cursor-pointer" title="Logg inn">➡️</span>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="/Frilansportalen_logo_skarp.jpeg"
          alt="Frilansportalen logo"
          style={{ width: "400px", height: "auto" }}
        />
      </div>

      {/* Velkomsttekst */}
      <h1 className="text-center text-2xl font-bold mb-6">
        Velkommen til Frilansportalen – plattformen for arbeidsgivere, frilansere, jobbsøkere og tjenester
      </h1>

      {/* Hovedvalg */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <Link href="/arbeidsgiver" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">💼</span> Arbeidsgiver
          </a>
        </Link>
        <Link href="/frilanser" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">👤</span> Frilanser
          </a>
        </Link>
        <Link href="/jobbsoker" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">🔍</span> Jobbsøker
          </a>
        </Link>
        <Link href="/tjenestetilbyder" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">🔨</span> Tjenestetilbyder
          </a>
        </Link>
        <Link href="/markeder" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">🏬</span> Markeder
          </a>
        </Link>
        <Link href="/dugnadsportalen" legacyBehavior>
          <a className="bg-gray-100 rounded-2xl shadow p-6 flex items-center gap-4 text-lg hover:bg-white">
            <span className="text-2xl">🤝</span> Dugnadsportalen
          </a>
        </Link>
      </div>
    </main>
  );
}
