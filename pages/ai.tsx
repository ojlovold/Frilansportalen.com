import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function AI() {
  const [klar, setKlar] = useState(false);

  return (
    <Layout>
      <Head>
        <title>AI-assistent | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">AI-assistent</h1>

      <div className="bg-white border border-black rounded p-4 text-sm max-w-lg">
        <p className="mb-4">
          Her kan du få hjelp av en intelligent assistent til å skrive stillingsannonser, svare på meldinger, lage fakturaer og mye mer.
        </p>

        <div className={`mb-4 p-3 rounded text-white ${klar ? "bg-green-600" : "bg-yellow-600"}`}>
          Status: {klar ? "AI er aktivert" : "AI er ikke aktivert ennå"}
        </div>

        <button
          onClick={() => setKlar(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          {klar ? "Start samtale" : "Aktiver AI-assistent"}
        </button>
      </div>
    </Layout>
  );
}
