import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

const resultater = [
  {
    navn: "Logodesigner – 40%",
    type: "Stilling",
    match: 92,
  },
  {
    navn: "Frilanserprofil: Tina J. (Frontend + UX)",
    type: "Kandidat",
    match: 89,
  },
  {
    navn: "Kurs: GDPR for frilansere",
    type: "Kurs",
    match: 86,
  },
];

export default function Smartsok() {
  const [sok, setSok] = useState("");
  const filtrert = resultater.filter((r) =>
    r.navn.toLowerCase().includes(sok.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Smartsøk | Frilansportalen</title>
        <meta name="description" content="Søk med AI – se forslag og matching for stillinger, tjenester og kurs" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Smartsøk</h1>

        <input
          type="text"
          placeholder="Skriv søkeord..."
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="mb-6 p-2 border rounded w-full"
        />

        <ul className="space-y-4">
          {filtrert.map((r, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{r.navn}</p>
              <p className="text-sm text-gray-600">{r.type} – AI-match: {r.match}%</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
