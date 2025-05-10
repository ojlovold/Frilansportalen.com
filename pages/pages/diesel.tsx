import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function DieselKalkulator() {
  const [km, setKm] = useState(0);
  const [forbruk, setForbruk] = useState(0.7); // liter per mil
  const [literpris, setLiterpris] = useState(22.0);
  const [kostnad, setKostnad] = useState<number | null>(null);

  const kalkuler = () => {
    const mil = km / 10;
    const liter = mil * forbruk;
    const sum = liter * literpris;
    setKostnad(Math.round(sum));
  };

  return (
    <Layout>
      <Head>
        <title>Dieselforbruk | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Dieselkostnadskalkulator</h1>

      <div className="grid gap-4 max-w-lg">
        <input
          placeholder="Kilometer"
          type="number"
          value={km}
          onChange={(e) => setKm(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <input
          placeholder="Forbruk (liter per mil)"
          type="number"
          value={forbruk}
          onChange={(e) => setForbruk(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <input
          placeholder="Dieselpris (kr/l)"
          type="number"
          value={literpris}
          onChange={(e) => setLiterpris(parseFloat(e.target.value || "0"))}
          className="p-2 border rounded"
        />
        <button
          onClick={kalkuler}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Kalkuler kostnad
        </button>
        {kostnad !== null && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 rounded p-3 text-sm">
            Beregnet drivstoffkostnad: <strong>{kostnad} kr</strong>
          </div>
        )}
      </div>
    </Layout>
  );
}
