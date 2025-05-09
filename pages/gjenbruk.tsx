import Head from "next/head";
import Header from "../components/Header";

export default function Gjenbruk() {
  return (
    <>
      <Head>
        <title>Gjenbruk | Frilansportalen</title>
        <meta name="description" content="Gjenbruksportal – gratis annonser for ting og utstyr" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Gjenbruksportalen</h1>
        <p>Legg ut ting gratis eller for en liten sum. Alt fra gulv til tak, helt gratis å publisere.</p>
      </main>
    </>
  );
}
