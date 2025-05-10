import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Kurs() {
  const kursliste = [
    { navn: "HMS for frilansere", beskrivelse: "Grunnkurs i HMS", sted: "Digitalt" },
    { navn: "Regnskap gjort enkelt", beskrivelse: "Forstå fradrag og MVA", sted: "Oslo" },
    { navn: "Hvordan skrive kontrakt", beskrivelse: "Kontraktsmaler og tips", sted: "Stavanger" },
  ];

  return (
    <Layout>
      <Head>
        <title>Kurs | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Kursoversikt</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kursliste.map(({ navn, beskrivelse, sted }, i) => (
          <div key={i} className="border border-black bg-white rounded-xl p-4">
            <h2 className="text-lg font-semibold">{navn}</h2>
            <p className="text-sm text-gray-600 mt-1">{beskrivelse}</p>
            <p className="text-sm text-gray-600 mb-2">Sted: {sted}</p>
            <Link href="#" className="text-sm underline hover:text-black">
              Les mer
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
