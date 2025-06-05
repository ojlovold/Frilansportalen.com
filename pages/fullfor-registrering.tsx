// pages/fullfor-registrering.tsx
"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function FullforRegistrering() {
  const router = useRouter();
  const [roller, setRoller] = useState<string[]>([]);
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");

  useEffect(() => {
    if (router.isReady) {
      const queryRoller = router.query.roller;
      if (typeof queryRoller === "string") {
        setRoller(queryRoller.split(","));
      }
    }
  }, [router]);

  const handleRegistrer = () => {
    if (!navn || !epost || !passord || roller.length === 0) return;

    // TODO: Send til Supabase
    console.log("Registrerer:", { navn, epost, passord, roller });

    router.push("/velkommen");
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white font-sans bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      <div className="max-w-md mx-auto bg-black/60 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Fullfør registreringen</h1>

        <p className="text-white/80 text-sm mb-6">
          Du har valgt følgende roller:
        </p>
        <ul className="mb-6 text-sm list-disc list-inside text-white/90">
          {roller.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Navn"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          />
          <input
            type="email"
            placeholder="E-post"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          />
          <input
            type="password"
            placeholder="Passord"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
          />
        </div>

        <button
          onClick={handleRegistrer}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition"
        >
          Fullfør registrering
        </button>
      </div>
    </main>
  );
}
