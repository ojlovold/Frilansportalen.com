import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
        <h1 className="text-xl font-bold">Frilansportalen</h1>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link href="/">Hjem</Link>
          <Link href="/reise">Reise</Link>
          <Link href="/stillinger">Stillinger</Link>
          <Link href="/tjenester">Tjenester</Link>
          <Link href="/gjenbruk">Gjenbruk</Link>
          <Link href="/kurs">Kurs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
