import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const logger = [
  { tid: "21. mai kl. 09:03", hendelse: "Innlogging fra ny enhet", ip: "92.168.0.14" },
  { tid: "18. mai kl. 20:45", hendelse: "Nedlasting av faktura", ip: "92.168.0.8" },
  { tid: "17. mai kl. 11:20", hendelse: "Endret passord", ip: "92.168.0.3" },
];

export default function Sikkerhet() {
  const [eksportert, setEksportert] = useState(false);
  const [slettet, setSlettet] = useState(false);

  return (
    <>
      <Head>
        <title>Sikkerhet og personvern | Frilansportalen</title>
        <meta name="description" content="Se sikkerhetslogg, eksporter dine data og slett konto" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sikkerhet og personvern</h1>

        <h2 className="text-xl font-semibold mb-2">Sikkerhetslogg</h2>
        <ul className="space-y-2 mb-6">
          {logger.map((l, i) => (
            <li key={i} className="bg-white p-3 rounded shadow">
              <p className="font-semibold">{l.hendelse}</p>
              <p className="text-sm text-gray-600">{l.tid} – IP: {l.ip}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Dine rettigheter</h2>
        <div className="bg-white p-4 rounded shadow space-y-4">
          {!eksportert ? (
            <button onClick={() => setEksportert(true)} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Eksporter mine data (GDPR)
            </button>
          ) : (
            <p className="text-green-700">Data er eksportert som .zip (simulert)</p>
          )}

          {!slettet ? (
            <button onClick={() => setSlettet(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Slett konto og alle data
            </button>
          ) : (
            <p className="text-red-700">Kontoen er slettet (simulert)</p>
          )}
        </div>
      </main>
    </>
  );
}
