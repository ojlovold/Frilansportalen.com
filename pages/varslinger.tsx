import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

interface Varsel {
  type: "melding" | "svar" | "interesse" | "videosamtale";
  tekst: string;
  tid: string;
}

const varsler: Varsel[] = [
  { type: "melding", tekst: "Du har mottatt en ny melding fra Line A.", tid: "10:42 i dag" },
  { type: "svar", tekst: "Din søknad er besvart av Nordic Studio.", tid: "i går, 21:17" },
  { type: "interesse", tekst: "En arbeidsgiver har vist interesse for profilen din.", tid: "i går, 08:03" },
  { type: "videosamtale", tekst: "Ny videosamtale forespurt av Ola S.", tid: "onsdag, 15:20" },
];

export default function Varslinger() {
  return (
    <>
      <Head>
        <title>Varslinger | Frilansportalen</title>
        <meta name="description" content="Dine varsler: meldinger, videosamtaler og søknadssvar" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Varslinger</h1>

        <ul className="space-y-4">
          {varsler.map((v, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold capitalize">{v.type}</p>
              <p>{v.tekst}</p>
              <p className="text-sm text-gray-600">{v.tid}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
