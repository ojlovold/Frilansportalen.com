// pages/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-300 flex flex-col items-center justify-center text-black">
      <Head>
        <title>Frilansportalen</title>
        <meta name="description" content="Frilansportalen for arbeidsgivere, frilansere og tjenestetilbydere" />
      </Head>

      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <Image src="/logo.png" alt="Frilansportalen logo" width={160} height={40} />
        <Link href="/login" className="text-sm text-blue-600 underline">
          Logg inn
        </Link>
      </header>

      <main className="flex flex-col items-center space-y-6 mt-24">
        {["Arbeidsgiver", "Frilanser", "Jobbsøker", "Tjenestetilbyder", "Markeder"].map((label) => (
          <Link
            key={label}
            href={`/${label.toLowerCase().replace('ø', 'o')}`}
            className="w-64 bg-white text-center py-4 rounded-xl shadow text-lg font-semibold hover:bg-gray-100 transition"
          >
            {label}
          </Link>
        ))}
      </main>
    </div>
  );
}
