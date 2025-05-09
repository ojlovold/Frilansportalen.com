import Head from "next/head";
import Header from "@/components/Header";
import { useState } from "react";

export default function Faktura() {
  const [mottaker, setMottaker] = useState("");
  const [belop, setBelop] = useState("");
  const [melding, setMelding] = useState("");
  const [sendt, setSendt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Faktura sendt:", { mottaker, belop, melding });
    setSendt(true);
    setMottaker("");
    setBelop("");
    setMelding("");
  };

  return (
    <>
      <Head>
        <title>Send faktura | Frilansportalen</title>
        <meta name="description" content="Send fakturaer direkte til arbeidsgivere via Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Send faktura</h1>

        {sendt ? (
          <p className="text-green-700 font-semibold">Faktura sendt!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Mottaker:</label>
              <input
                type="text"
                value={mottaker}
                onChange={(e) => setMottaker(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Beløp (kr):</label>
              <input
                type="number"
                value={belop}
                onChange={(e) => setBelop(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Melding (valgfritt):</label>
              <textarea
                value={melding}
                onChange={(e) => setMelding(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Send faktura
            </button>
          </form>
        )}
      </main>
    </>
  );
}
