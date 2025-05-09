import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

interface Melding {
  avsender: "deg" | "mottaker";
  tekst: string;
}

export default function Chat() {
  const [meldinger, setMeldinger] = useState<Melding[]>([
    { avsender: "mottaker", tekst: "Hei! Er du ledig neste uke?" },
    { avsender: "deg", tekst: "Ja, det passer fint!" },
  ]);
  const [tekst, setTekst] = useState("");

  const sendMelding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tekst.trim()) return;
    setMeldinger([...meldinger, { avsender: "deg", tekst }]);
    setTekst("");
  };

  return (
    <>
      <Head>
        <title>Chat | Frilansportalen</title>
        <meta name="description" content="Kommuniser direkte med andre brukere i Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Samtale</h1>

        <div className="bg-white p-4 rounded shadow mb-4 h-64 overflow-y-scroll flex flex-col space-y-2">
          {meldinger.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-xs ${
                m.avsender === "deg"
                  ? "bg-green-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              {m.tekst}
            </div>
          ))}
        </div>

        <form onSubmit={sendMelding} className="flex space-x-2">
          <input
            type="text"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Skriv en melding..."
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Send
          </button>
        </form>
      </main>
    </>
  );
}
