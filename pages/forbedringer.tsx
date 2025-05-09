import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const forslag = [
  {
    tittel: "Legg til autosvar i meldinger",
    beskrivelse: "Brukere kan sette opp egne maler for automatiske svar.",
  },
  {
    tittel: "Smart forslag til kurs",
    beskrivelse: "Basert på brukerens profil og oppdrag, foreslå relevante kurs.",
  },
  {
    tittel: "Anbefalt frilanser-visning",
    beskrivelse: "Arbeidsgivere får AI-generert anbefaling basert på behov.",
  },
];

export default function Forbedringer() {
  const [aktivt, setAktivt] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Forbedringsforslag | Frilansportalen</title>
        <meta name="description" content="Se og aktiver smarte forbedringer i Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">AI-forbedringsforslag</h1>

        <ul className="space-y-4">
          {forslag.map((f, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{f.tittel}</h2>
              <p className="text-sm mb-2 text-gray-600">{f.beskrivelse}</p>
              <button
                onClick={() => setAktivt(f.tittel)}
                className={`px-4 py-2 rounded ${
                  aktivt === f.tittel ? "bg-green-600 text-white" : "bg-black text-white"
                }`}
              >
                {aktivt === f.tittel ? "Aktivert" : "Test i tvillingportal"}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
