import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Verifisering() {
  const [verifisert, setVerifisert] = useState(false);
  const [kode, setKode] = useState("");
  const [feil, setFeil] = useState("");

  const riktigKode = "8472"; // kan byttes ut med CAPTCHA eller AI senere

  const bekreft = () => {
    if (kode === riktigKode) {
      setVerifisert(true);
      setFeil("");
    } else {
      setFeil("Feil kode. Prøv igjen.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Bekreft at du er et menneske | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Bekreft at du er et menneske</h1>

        {verifisert ? (
          <p className="text-green-600">Takk! Du er nå verifisert.</p>
        ) : (
          <>
            <p className="text-sm mb-4 text-gray-700">
              Skriv inn den midlertidige koden du har mottatt, eller svar på verifisering.
            </p>

            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Skriv kode"
              className="p-2 border rounded mb-3 w-full"
            />

            <button
              onClick={bekreft}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 w-full"
            >
              Bekreft
            </button>

            {feil && <p className="text-red-600 text-sm mt-3">{feil}</p>}
          </>
        )}
      </div>
    </Layout>
  );
}
