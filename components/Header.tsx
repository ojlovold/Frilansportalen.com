import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <Link href="/" className="mb-2 sm:mb-0 block text-xl">
          <span className="font-extrabold">FRILANS</span>
          <span className="font-light">PORTALEN</span>
        </Link>

        {/* Meny */}
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
          <Link href="/">Hjem</Link>
          <Link href="/stillinger">Stillinger</Link>
          <Link href="/tjenester">Tjenester</Link>
          <Link href="/gjenbruk">Gjenbruk</Link>
          <Link href="/kurs">Kurs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/ai">AI</Link>
        </nav>
      </div>
    </header>
  );
}
