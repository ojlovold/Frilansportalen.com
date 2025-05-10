import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Reise() {
  const [fra, setFra] = useState("Oslo");
  const [til, setTil] = useState("Stavanger");
  const [fergePris, setFergePris] = useState(350);
  const [bom, setBom] = useState(210);
  const [kilometer, setKilometer] = useState(500);
  const [pris, setPris] = useState<number | null>(null);

  const beregn = () => {
    const total = fergePris + bom + kilometer * 4.2;
    setPris(Math.round(total));
  };

  return (
    <>
      <Head>
        <title>Reise og rute | Frilansportalen</title>
        <meta name="description" content="Beregning av reisekostnader – bom, ferge og kjøring" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Reise- og ruteoversikt</h1>

        <div className="grid gap-4">
          <div>
            <label className="block font-semibold">Fra:</label>
            <input type="text" value={fra} onChange={(e) => setFra(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Til:</label>
            <input type="text" value={til} onChange={(e) => setTil(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Kilometer:</label>
            <input type="number" value={kilometer} onChange={(e) => setKilometer(parseInt(e.target.value || "0"))} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Fergekostnad (kr):</label>
            <input type="number" value={fergePris} onChange={(e) => setFergePris(parseInt(e.target.value || "0"))} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Bomkostnad (kr):</label>
            <input type="number" value={bom} onChange={(e) => setBom(parseInt(e.target.value || "0"))} className="w-full p-2 border rounded" />
          </div>

          <button onClick={beregn} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Beregn kostnad
          </button>

          {pris !== null && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-800 p-4 rounded">
              Total reisekostnad: <strong>{pris} kr</strong>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
