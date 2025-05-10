import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <Link href="/" className="block text-2xl font-extrabold tracking-tight">
          <span className="mr-1">FRILANS</span>
          <span className="font-light">PORTALEN</span>
        </Link>

        {/* Meny */}
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mt-4 sm:mt-0">
          <Link href="/stillinger">Stillinger</Link>
          <Link href="/tjenester">Tjenester</Link>
          <Link href="/gjenbruk">Gjenbruk</Link>
          <Link href="/kurs">Kurs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/ai">AI</Link>
        </nav>

        {/* Innlogging */}
        <div className="mt-4 sm:mt-0">
          <Link href="/login">
            <button className="bg-white text-black px-4 py-1 rounded font-semibold hover:bg-gray-200 text-sm">
              Logg inn
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
