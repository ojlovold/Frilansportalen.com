import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Betaling() {
  const [betalt, setBetalt] = useState(false);
  const [produkt, setProdukt] = useState("Stillingsannonse");
  const [beløp, setBeløp] = useState(1000);

  const handleBetaling = (e: React.FormEvent) => {
    e.preventDefault();
    // Her vil Stripe/Vipps kobles inn i neste steg
    console.log("Betalt for:", produkt, beløp);
    setBetalt(true);
  };

  return (
    <>
      <Head>
        <title>Betaling | Frilansportalen</title>
        <meta name="description" content="Gjennomfør betaling for annonser og tjenester" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Betaling</h1>

        {betalt ? (
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            <p className="font-semibold mb-2">Takk for betalingen!</p>
            <p>Produkt: {produkt}</p>
            <p>Beløp: {beløp} kr</p>
          </div>
        ) : (
          <form onSubmit={handleBetaling} className="space-y-4">
            <div>
              <label className="block font-semibold">Velg produkt:</label>
              <select
                value={produkt}
                onChange={(e) => setProdukt(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option>Stillingsannonse</option>
                <option>Frilanser Premium</option>
                <option>Tjenesteprofil</option>
                <option>Bannerannonse</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Beløp (kr):</label>
              <input
                type="number"
                value={beløp}
                onChange={(e) => setBeløp(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Betal nå
            </button>
          </form>
        )}
      </main>
    </>
  );
}
