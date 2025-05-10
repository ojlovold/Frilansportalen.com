import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Rutekalkulator() {
  const [fra, setFra] = useState("");
  const [til, setTil] = useState("");
  const [km, setKm] = useState(0);
  const [ferge, setFerge] = useState(0);
  const [bom, setBom] = useState(0);
  const [sum, setSum] = useState<number | null>(null);

  const beregn = () => {
    const total = km * 4.2 + bom + ferge;
    setSum(Math.round(total));
  };

  return (
    <Layout>
      <Head>
        <title>Rutekalkulator | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Rutekalkulator</h1>

      <div className="grid gap-4 max-w-lg">
        <input placeholder="Fra" value={fra} onChange={(e) => setFra(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Til" value={til} onChange={(e) => setTil(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Kilometer" type="number" value={km} onChange={(e) => setKm(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Bom (kr)" type="number" value={bom} onChange={(e) => setBom(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Ferge (kr)" type="number" value={ferge} onChange={(e) => setFerge(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <button onClick={beregn} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Beregn
        </button>
        {sum !== null && (
          <div className="bg-green-100 border border-green-400 text-green-800 rounded p-3 text-sm">
            Total kostnad: <strong>{sum} kr</strong>
          </div>
        )}
      </div>
    </Layout>
  );
}
