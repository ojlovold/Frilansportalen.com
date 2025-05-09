import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Frilansportalen</h1>
      <nav className="flex space-x-4">
        <Link href="/" className="hover:underline">Hjem</Link>
        <Link href="/stillinger" className="hover:underline">Stillinger</Link>
        <Link href="/tjenester" className="hover:underline">Tjenester</Link>
        <Link href="/gjenbruk" className="hover:underline">Gjenbruk</Link>
        <Link href="/kurs" className="hover:underline">Kurs</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/admin" className="hover:underline">Admin</Link>
      </nav>
    </header>
  );
}
