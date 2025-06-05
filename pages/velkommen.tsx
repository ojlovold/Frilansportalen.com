// pages/velkommen.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Velkommen() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [navn, setNavn] = useState<string | null>(null);
  const [opprettet, setOpprettet] = useState(false);

  useEffect(() => {
    const opprettProfilHvisNy = async () => {
      if (!user || opprettet) return;

      // 1. Sjekk om profil finnes fra før
      const { data: eksisterer, error } = await supabase
        .from("profiler")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!eksisterer) {
        const brukerdata = user.user_metadata || {};
        const { data, error: insertError } = await supabase
          .from("profiler")
          .insert([
            {
              id: user.id,
              navn: brukerdata.navn || "Ukjent",
              epost: user.email,
              roller: [], // Kan endres dersom roller lagres et annet sted
            },
          ]);

        if (insertError) {
          console.error("Feil ved oppretting av profil:", insertError);
        } else {
          setOpprettet(true);
        }
      } else {
        setOpprettet(true);
      }

      setNavn(user.user_metadata?.navn || "venn");
    };

    opprettProfilHvisNy();
  }, [user, supabase, opprettet]);

  const handleNeste = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white font-sans">
      <div className="bg-black/60 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 drop-shadow">
          Velkommen{navn ? `, ${navn}` : "!"}
        </h1>
        <p className="text-white/80 mb-6 text-sm">
          Kontoen din er nå aktivert og profilen er klar. Du er klar til å ta i bruk Frilansportalen!
        </p>
        <button
          onClick={handleNeste}
          className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-200 transition"
        >
          Gå til dashboard
        </button>
      </div>
    </main>
  );
}
