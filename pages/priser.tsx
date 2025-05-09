import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const startPriser = {
  arbeidsgiverAbonnement: 1000,
  stillingsannonse: 1000,
  tjenestetilbyderProfil: 100,
  frilanserPremium: 100,
  bannerannonse: 500,
  profilannonse: 1000,
};

export default function Priser() {
  const [priser, setPriser] = useState(startPriser);

  const handleChange = (key: keyof typeof priser, value: number) => {
    setPriser((prev) => ({ ...prev, [key]: value }));
  };

  const lagre = () => {
    console.log("Priser lagret:", priser);
    alert("Prisene er lagret (simulert).");
  };

  return (
    <>
      <Head>
        <title>Prismodul | Frilansportalen</title>
        <meta name="description" content="Justér priser for annonser, abonnement og tjenester" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Prismodul</h1>

        {Object.entries(priser).map(([nøkkel, verdi]) => (
          <div key={nøkkel} className="mb-4">
            <label className="block font-semibold mb-1">{nøkkel}</label>
            <input
              type="number"
              value={verdi}
              onChange={(e) => handleChange(nøkkel as keyof typeof priser, parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Lagre priser
        </button>
      </main>
    </>
  );
}
