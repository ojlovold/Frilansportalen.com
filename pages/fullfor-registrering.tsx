// pages/fullfor-registrering.tsx
"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function FullforRegistrering() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [roller, setRoller] = useState<string[]>([]);
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");

  useEffect(() => {
    if (router.isReady) {
      const queryRoller = router.query.roller;
      if (typeof queryRoller === "string") {
        setRoller(queryRoller.split(","));
      }
    }
  }, [router]);

  const handleRegistrer = async () => {
    setFeil("");

    if (!navn || !epost || !passord || roller.length === 0) {
      setFeil("Vennligst fyll ut alle felt.");
      return;
    }

    // 1. Opprett bruker i Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: epost,
      password: passord,
      options: {
        data: { navn },
      },
    });

    if (signUpError || !signUpData.user) {
      setFeil(signUpError?.message || "Feil ved registrering.");
      return;
    }

    const bruker_id = signUpData.user.id;

    // 2. Lagre profil og roller i Supabase-database
    const { error: profilError } = await supabase.from("profiler").insert([
      {
        id: bruker_id,
        navn,
        epost,
        roller,
      },
    ]);

    if (profilError) {
      setFeil("Kunne ikke lagre profil: " + profilError.message);
      return;
    }

    // 3. Ferdig – send til velkomstside eller dashboard
    router.push("/velkommen");
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white font-sans bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      <div className="max-w-md mx-auto bg-black/60 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Fullfør registreringen</h1>

        {feil && <p className="text-red-400 text-sm mb-4">{feil}</p>}

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
