import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Annonse() {
  const [input, setInput] = useState("");
  const [visning, setVisning] = useState<string | null>(null);

  const generer = () => {
    // Midlertidig eksempel. Erstattes av ekte AI-integrasjon.
    const annonse = `Vi søker ${input.toLowerCase()} som kan bidra med sin erfaring, arbeidsvilje og fleksibilitet. Oppstart etter avtale.`;
    setVisning(annonse);
  };

  return (
    <Layout>
      <Head>
        <title>Lag stillingsannonse | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Lag stillingsannonse med AI</h1>

      <div className="grid gap-4 max-w-lg">
        <input
          placeholder="F.eks. fotograf, snekker, regnskapsfører"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={generer}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Generer annonse
        </button>

        {visning && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 rounded p-4 text-sm mt-2">
            <h2 className="font-semibold mb-2">Forslag:</h2>
            <p>{visning}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
