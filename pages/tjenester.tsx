import Head from "next/head";
import Header from "../components/Header";

export default function Tjenester() {
  return (
    <>
      <Head>
        <title>Tjenester | Frilansportalen</title>
        <meta name="description" content="Finn og tilby tjenester – alt fra frisør til barnepass" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Tjenestetilbydere</h1>
        <p>Her finner du folk som tilbyr praktiske tjenester – synlige, søkbare og tilgjengelige.</p>
      </main>
    </>
  );
}
