// pages/dashboard.tsx
import Head from 'next/head'
import Dashboard from '../components/Dashboard'
import NotificationBell from '../components/NotificationBell'
import Link from 'next/link'

export default function BrukerDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Frilansportalen</title>
        <meta name="description" content="Ditt personlige dashbord" />
      </Head>

      <Dashboard>
        <div className="flex justify-end mb-6">
          <NotificationBell />
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          <Link href="/profil">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Rediger profil
            </div>
          </Link>

          <Link href="/rapporteksport">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Eksport og dokumenter
            </div>
          </Link>

          <Link href="/mine-signaturer">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Mine signaturer
            </div>
          </Link>

          <Link href="/favoritter">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Mine favoritter
            </div>
          </Link>

          <Link href="/varslinger">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Jobbagenter og varslinger
            </div>
          </Link>

          <Link href="/sokehistorikk">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Søkehistorikk
            </div>
          </Link>

          <Link href="/visningslogg">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Visningslogg
            </div>
          </Link>
        </div>
      </Dashboard>
    </>
  )
}
