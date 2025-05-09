import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Kalender() {
  const [tilgjengelig, setTilgjengelig] = useState<{ [dato: string]: boolean }>({});

  const toggle = (dato: string) => {
    setTilgjengelig((prev) => ({
      ...prev,
      [dato]: !prev[dato],
    }));
  };

  const dager = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <>
      <Head>
        <title>Rutekalender | Frilansportalen</title>
        <meta name="description" content="Vis og styr din tilgjengelighet i rutekalenderen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Min tilgjengelighet</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dager.map((dato) => (
            <button
              key={dato}
              onClick={() => toggle(dato)}
              className={`p-4 rounded border ${
                tilgjengelig[dato] ? "bg-green-500 text-white" : "bg-white text-black"
              }`}
            >
              {dato} – {tilgjengelig[dato] ? "Ledig" : "Opptatt"}
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
