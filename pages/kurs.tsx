import Head from "next/head";
import Header from "@/components/Header";
import { useState } from "react";

interface Kurs {
  tittel: string;
  kategori: string;
  beskrivelse: string;
}

const dummyKurs: Kurs[] = [
  {
    tittel: "HMS for frilansere",
    kategori: "HMS",
    beskrivelse: "Et grunnkurs i helse, miljø og sikkerhet for frilansere i alle bransjer.",
  },
  {
    tittel: "Effektiv kommunikasjon",
    kategori: "Personlig utvikling",
    beskrivelse: "Lær å samarbeide, forhandle og formidle tydelig – digitalt og fysisk.",
  },
];

export default function Kurs() {
  const [filter, setFilter] = useState("");

  const filtrert = dummyKurs.filter((kurs) =>
    kurs.kategori.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Kurs | Frilansportalen</title>
        <meta name="description" content="Kurs og opplæring for frilansere – faglig utvikling på dine vilkår" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Kurs og opplæring</h1>

        <input
          type="text"
          placeholder="Filtrer på kategori..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-6 p-2 border rounded w-full max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtrert.map((kurs, i) => (
            <div key={i} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{kurs.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">{kurs.kategori}</p>
              <p>{kurs.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
