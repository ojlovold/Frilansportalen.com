import Head from "next/head";
import Header from "../components/Header";

export default function Stillinger() {
  return (
    <>
      <Head>
        <title>Stillinger | Frilansportalen</title>
        <meta name="description" content="Finn ledige frilansoppdrag og jobber" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Ledige stillinger</h1>
        <p>Her vil du finne annonser og oppdrag som passer for deg.</p>
      </main>
    </>
  );
}
