import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Anbud() {
  const [km, setKm] = useState("");
  const [timepris, setTimepris] = useState("");
  const [timer, setTimer] = useState("");
  const [diesel, setDiesel] = useState("");
  const [pris, setPris] = useState<number | null>(null);

  const beregn = (e: React.FormEvent) => {
    e.preventDefault();
    const kmPris = parseFloat(km) * 4.2;
    const tidsPris = parseFloat(timer) * parseFloat(timepris);
    const drivstoff = parseFloat(km) * (parseFloat(diesel) / 10);
    const sum = kmPris + tidsPris + drivstoff;
    setPris(Math.round(sum));
  };

  return (
    <>
      <Head>
        <title>Anbudskalkulator | Frilansportalen</title>
        <meta name="description" content="Beregn pris på oppdrag med kjøretøy, tid og forbruk" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Anbudskalkulator</h1>

        <form onSubmit={beregn} className="space-y-4 max-w-xl">
          <div>
            <label className="block font-semibold">Kilometer (tur/retur):</label>
            <input type="number" value={km} onChange={(e) => setKm(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold">Timer estimert:</label>
            <input type="number" value={timer} onChange={(e) => setTimer(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold">Timepris (kr):</label>
            <input type="number" value={timepris} onChange={(e) => setTimepris(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold">Dieselforbruk per 10 km (liter):</label>
            <input type="number" value={diesel} onChange={(e) => setDiesel(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Beregn pris
          </button>
        </form>

        {pris !== null && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded">
            <p className="font-bold text-lg">Anslått pris: {pris} kr</p>
          </div>
        )}
      </main>
    </>
  );
}
