// pages/kart.tsx
import Head from 'next/head'
import Map from '../components/Map'

export default function Kart() {
  const testMarkører = [
    { lat: 59.9111, lng: 10.7528, tekst: 'Oslo' },
    { lat: 60.39299, lng: 5.32415, tekst: 'Bergen' },
    { lat: 63.4305, lng: 10.3951, tekst: 'Trondheim' },
  ]

  return (
    <>
      <Head>
        <title>Kart | Frilansportalen</title>
        <meta name="description" content="Kartvisning av stillinger og tjenester" />
      </Head>
      <main className="p-8 bg-portalGul min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Kartvisning</h1>
        <Map markører={testMarkører} />
      </main>
    </>
  )
}
