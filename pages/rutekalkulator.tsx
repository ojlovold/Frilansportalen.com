import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Rutekalkulator() {
  const [start, setStart] = useState("");
  const [slutt, setSlutt] = useState("");
  const [km, setKm] = useState(0);
  const [bompenger, setBompenger] = useState(0);
  const [ferge, setFerge] = useState(0);
  const [liter, setLiter] = useState(0);
  const [pris, setPris] = useState(0);

  const kalkuler = () => {
    const drivstoff = liter * 22; // eksempelpris per liter
    const total = bompenger + ferge + drivstoff;
    setPris(total);
  };

  return (
    <Layout>
      <Head>
        <title>Rutekalkulator | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Kalkuler reiseutgifter</h1>

        <input
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Startsted"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          value={slutt}
          onChange={(e) => setSlutt(e.target.value)}
          placeholder="Sluttsted"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={km}
          onChange={(e) => setKm(parseFloat(e.target.value))}
          placeholder="Antall kilometer"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={bompenger}
          onChange={(e) => setBompenger(parseFloat(e.target.value))}
          placeholder="Bompenger (kr)"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={ferge}
          onChange={(e) => setFerge(parseFloat(e.target.value))}
          placeholder="Fergebilletter (kr)"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={liter}
          onChange={(e) => setLiter(parseFloat(e.target.value))}
          placeholder="Diesel/liter totalt"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={kalkuler}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Kalkuler totalpris
        </button>

        <p className="text-sm mt-4">Estimert reiseutgift: <strong>{pris} kr</strong></p>
      </div>
    </Layout>
  );
}
