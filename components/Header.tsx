import Link from 'next/link'
import NotificationBell from './NotificationBell'

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold text-black">Frilansportalen</h1>
        </Link>

        <div className="flex items-center gap-6">
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
            <Link href="/varslinger">
              <span className="hover:underline">Varslinger</span>
            </Link>
            <Link href="/sokehistorikk">
              <span className="hover:underline">Søkehistorikk</span>
            </Link>
            <Link href="/visningslogg">
              <span className="hover:underline">Visningslogg</span>
            </Link>
            <Link href="/mine-signaturer">
              <span className="hover:underline">Signaturer</span>
            </Link>
            <Link href="/admin/systemstatus">
              <span className="hover:underline text-red-600">Systemstatus</span>
            </Link>
          </nav>

          {/* Varslingsbjelle plassert helt til høyre */}
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
