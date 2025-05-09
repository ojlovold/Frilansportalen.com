import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const overtaketil = {
  navn: "Elise Mathea Syverine Thunem Løvold",
  kanal: "Messenger",
  telefon: "+47 474 15 152",
};

export default function Eierskifte() {
  const [inaktiveDager, setInaktiveDager] = useState(42);
  const [klar, setKlar] = useState(false);

  const godkjenn = () => {
    setKlar(true);
  };

  return (
    <>
      <Head>
        <title>Eierskifte | Frilansportalen</title>
        <meta name="description" content="Automatisk overtakelse ved inaktivitet – administrasjonsverktøy" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Eierskifte ved inaktivitet</h1>

        <p className="mb-4">
          Systemet overvåker eierens aktivitet. Etter 30 dager varsles du, og etter 60 dager overtas portalen.
        </p>

        <div className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Dager uten aktivitet:</strong> {inaktiveDager}</p>
          <p><strong>Overtas av:</strong> {overtaketil.navn}</p>
          <p><strong>Via:</strong> {overtaketil.kanal} – {overtaketil.telefon}</p>
        </div>

        {!klar ? (
          <button onClick={godkjenn} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Jeg bekrefter og forstår
          </button>
        ) : (
          <p className="text-green-700 font-semibold">Eierskifteprosessen er aktivert og overvåkes automatisk.</p>
        )}
      </main>
    </>
  );
}
