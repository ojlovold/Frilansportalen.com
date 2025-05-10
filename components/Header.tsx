import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Frilansportalen</h1>
      <nav className="flex space-x-4">
        <Link href="/"><a className="hover:underline">Hjem</a></Link>
        <Link href="/stillinger"><a className="hover:underline">Stillinger</a></Link>
        <Link href="/tjenester"><a className="hover:underline">Tjenester</a></Link>
        <Link href="/gjenbruk"><a className="hover:underline">Gjenbruk</a></Link>
        <Link href="/kurs"><a className="hover:underline">Kurs</a></Link>
        <Link href="/dashboard"><a className="hover:underline">Dashboard</a></Link>
        <Link href="/admin"><a className="hover:underline">Admin</a></Link>
      </nav>
    </header>
  );
}
