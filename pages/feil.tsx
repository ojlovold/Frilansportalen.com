import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Feilside() {
  const [rapportert, setRapportert] = useState(false);
  const [forslått, setForslått] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Feilmeldinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Feil og forbedringsforslag</h1>

      {!rapportert ? (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm">Har du oppdaget en feil?</h2>
          <textarea className="w-full border rounded p-2 h-28 text-sm" placeholder="Beskriv feilen..."></textarea>
          <button
            onClick={() => setRapportert(true)}
            className="bg-black text-white px-4 py-2 mt-2 rounded hover:bg-gray-800 text-sm"
          >
            Send feilmelding
          </button>
        </div>
      ) : (
        <p className="text-sm text-green-700 mb-6">Takk! Feilen er sendt inn.</p>
      )}

      {!forslått ? (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm">Har du et forslag?</h2>
          <textarea className="w-full border rounded p-2 h-28 text-sm" placeholder="Hva kan bli bedre...?"></textarea>
          <button
            onClick={() => setForslått(true)}
            className="bg-black text-white px-4 py-2 mt-2 rounded hover:bg-gray-800 text-sm"
          >
            Send forslag
          </button>
        </div>
      ) : (
        <p className="text-sm text-blue-700">Takk for forslaget – vi vurderer det!</p>
      )}
    </Layout>
  );
}
