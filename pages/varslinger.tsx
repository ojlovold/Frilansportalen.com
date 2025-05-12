// pages/varslinger.tsx
import Head from 'next/head'
import Link from 'next/link'

export default function Varslinger() {
  return (
    <>
      <Head>
        <title>Mine varslinger | Frilansportalen</title>
        <meta name="description" content="Administrer jobbagenter og tjenestevarslinger" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mine varslinger</h1>

        <div className="space-y-4">
          <Link href="/stillingsovervaking">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Overvåkning – Stillinger
            </div>
          </Link>

          <Link href="/tjenesteovervaking">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Overvåkning – Tjenester
            </div>
          </Link>

          <Link href="/gjenbruksovervaking">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Overvåkning – Gjenbruksoppføringer
            </div>
          </Link>
        </div>
      </main>
    </>
  )
}
