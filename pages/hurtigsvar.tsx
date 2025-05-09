import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const svarforslag = [
  "Hei! Jeg er interessert og tilgjengelig.",
  "Takk for meldingen – jeg svarer mer utfyllende snart.",
  "Beklager, jeg har ikke kapasitet akkurat nå.",
];

export default function Hurtigsvar() {
  const [valgt, setValgt] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Hurtigsvar | Frilansportalen</title>
        <meta name="description" content="Svar raskt med ferdigformulerte AI-forslag" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hurtigsvar</h1>

        <ul className="space-y-4">
          {svarforslag.map((tekst, i) => (
            <li key={i} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <p>{tekst}</p>
              <button
                onClick={() => setValgt(tekst)}
                className="ml-4 bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Bruk
              </button>
            </li>
          ))}
        </ul>

        {valgt && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded">
            <p><strong>Valgt svar:</strong> {valgt}</p>
            <p className="text-sm mt-2">Svar er nå sendt (simulert)</p>
          </div>
        )}
      </main>
    </>
  );
}
