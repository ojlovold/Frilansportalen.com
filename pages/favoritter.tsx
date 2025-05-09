import Head from "next/head";
import Header from "@/components/Header";
import { useState } from "react";

interface Favoritt {
  tittel: string;
  type: "stilling" | "tjeneste" | "kurs";
}

const dummyFavoritter: Favoritt[] = [
  { tittel: "Webutvikler – 50%", type: "stilling" },
  { tittel: "HMS for frilansere", type: "kurs" },
  { tittel: "Frisør, Oslo", type: "tjeneste" },
];

export default function Favoritter() {
  const [favoritter, setFavoritter] = useState(dummyFavoritter);

  return (
    <>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
        <meta name="description" content="Lagrede stillinger, tjenester og kurs" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mine favoritter</h1>

        {favoritter.length === 0 ? (
          <p>Du har ikke lagret noen favoritter ennå.</p>
        ) : (
          <ul className="space-y-4">
            {favoritter.map((fav, i) => (
              <li key={i} className="bg-white p-4 rounded shadow">
                <span className="text-sm text-gray-600 capitalize">{fav.type}</span>
                <h2 className="text-lg font-semibold">{fav.tittel}</h2>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
