import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function KomplettAnbud() {
  const [km, setKm] = useState(0);
  const [ferge, setFerge] = useState(0);
  const [bom, setBom] = useState(0);
  const [forbruk, setForbruk] = useState(0.7);
  const [dieselpris, setDieselpris] = useState(22);
  const [timer, setTimer] = useState(0);
  const [prisPerTime, setPrisPerTime] = useState(600);
  const [resultat, setResultat] = useState<number | null>(null);

  const beregn = () => {
    const mil = km / 10;
    const dieselKost = mil * forbruk * dieselpris;
    const reiseKost = dieselKost + bom + ferge;
    const arbeidKost = timer * prisPerTime;
    const total = arbeidKost + reiseKost;
    setResultat(Math.round(total));
  };

  return (
    <Layout>
      <Head>
        <title>Komplett anbudskalkulator | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Komplett Anbudskalkulator</h1>

      <div className="grid gap-4 max-w-lg">
        <input placeholder="Kilometer" type="number" value={km} onChange={(e) => setKm(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Fergekostnad (kr)" type="number" value={ferge} onChange={(e) => setFerge(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Bomkostnad (kr)" type="number" value={bom} onChange={(e) => setBom(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Dieselforbruk (liter/mil)" type="number" value={forbruk} onChange={(e) => setForbruk(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Dieselpris (kr/l)" type="number" value={dieselpris} onChange={(e) => setDieselpris(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Arbeidstimer" type="number" value={timer} onChange={(e) => setTimer(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        <input placeholder="Timepris (kr)" type="number" value={prisPerTime} onChange={(e) => setPrisPerTime(parseFloat(e.target.value || "0"))} className="p-2 border rounded" />
        
        <button onClick={beregn} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Beregn totalpris
        </button>

        {resultat !== null && (
          <div className="bg-green-100 border border-green-400 text-green-800 rounded p-3 text-sm">
            Anbefalt totalpris: <strong>{resultat} kr</strong>
          </div>
        )}
      </div>
    </Layout>
  );
}
