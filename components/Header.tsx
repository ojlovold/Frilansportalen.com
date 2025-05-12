// components/Header.tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold text-black">Frilansportalen</h1>
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/dashboard">
            <span className="hover:underline">Dashboard</span>
          </Link>
          <Link href="/stillinger">
            <span className="hover:underline">Stillinger</span>
          </Link>
          <Link href="/tjenester">
            <span className="hover:underline">Tjenester</span>
          </Link>
          <Link href="/gjenbruk">
            <span className="hover:underline">Gjenbruk</span>
          </Link>
          <Link href="/favoritter">
            <span className="hover:underline">Mine favoritter</span>
          </Link>
          <Link href="/sokehistorikk">
            <span className="hover:underline">Søkehistorikk</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
