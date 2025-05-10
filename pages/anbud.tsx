import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Anbud() {
  const [timer, setTimer] = useState(0);
  const [prisPerTime, setPrisPerTime] = useState(0);
  const [reiseKost, setReiseKost] = useState(0);
  const [forslag, setForslag] = useState<number | null>(null);

  const beregn = () => {
    const total = timer * prisPerTime + reiseKost;
    setForslag(Math.round(total));
  };

  return (
    <Layout>
      <Head>
        <title>Anbudskalkulator | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Anbudskalkulator</h1>

      <div className="grid gap-4 max-w-lg">
        <input
          placeholder="Timer estimert"
          type="number"
          value={timer}
          onChange={(e) => setTimer(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <input
          placeholder="Pris per time (kr)"
          type="number"
          value={prisPerTime}
          onChange={(e) => setPrisPerTime(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <input
          placeholder="Reisekostnad (kr)"
          type="number"
          value={reiseKost}
          onChange={(e) => setReiseKost(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <button
          onClick={beregn}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Beregn prisforslag
        </button>
        {forslag !== null && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 rounded p-3 text-sm">
            Anbefalt prisforslag: <strong>{forslag} kr</strong>
          </div>
        )}
      </div>
    </Layout>
  );
}
