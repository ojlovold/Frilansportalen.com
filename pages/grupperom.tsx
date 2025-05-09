import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

interface Melding {
  avsender: string;
  tekst: string;
}

export default function Grupperom() {
  const [romNavn, setRomNavn] = useState("Arbeidslag #1");
  const [brukernavn, setBrukernavn] = useState("Frilanser");
  const [meldinger, setMeldinger] = useState<Melding[]>([]);
  const [tekst, setTekst] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tekst.trim()) return;
    setMeldinger([...meldinger, { avsender: brukernavn, tekst }]);
    setTekst("");
  };

  return (
    <>
      <Head>
        <title>Grupperom | Frilansportalen</title>
        <meta name="description" content="Samarbeid i grupperom med chat og fellesnavn" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Grupperom – {romNavn}</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Ditt navn:</label>
          <input
            type="text"
            value={brukernavn}
            onChange={(e) => setBrukernavn(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="bg-white p-4 rounded shadow mb-4 h-64 overflow-y-scroll flex flex-col space-y-2">
          {meldinger.map((m, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded shadow-sm">
              <strong>{m.avsender}:</strong> {m.tekst}
            </div>
          ))}
        </div>

        <form onSubmit={send} className="flex space-x-2">
          <input
            type="text"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Skriv melding..."
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Send
          </button>
        </form>
      </main>
    </>
  );
}
