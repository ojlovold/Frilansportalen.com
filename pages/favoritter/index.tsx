// pages/favoritter/index.tsx
import Head from 'next/head'
import Link from 'next/link'

export default function MineFavoritter() {
  return (
    <>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
        <meta name="description" content="Se alle dine lagrede oppføringer" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mine favoritter</h1>

        <div className="space-y-4">
          <Link href="/favoritter">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Lagrede stillingsannonser
            </div>
          </Link>

          <Link href="/favoritter-tjenester">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Lagrede tjenester
            </div>
          </Link>

          <Link href="/favoritter-gjenbruk">
            <div className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 transition">
              Lagrede gjenbruksoppføringer
            </div>
          </Link>
        </div>
      </main>
    </>
  )
}
