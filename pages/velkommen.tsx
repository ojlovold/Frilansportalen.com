// pages/velkommen.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Velkommen() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [navn, setNavn] = useState("");

  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiler")
        .select("navn")
        .eq("id", user.id)
        .single();

      if (data && data.navn) {
        setNavn(data.navn);
      }
    };

    hentProfil();
  }, [user, supabase]);

  const handleNeste = () => {
    router.push("/dashboard"); // eller f.eks. /min-profil
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-white font-sans">
      <div className="bg-black/50 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 drop-shadow">
          Velkommen{navn ? `, ${navn}` : ""}!
        </h1>
        <p className="text-white/80 mb-6 text-sm">
          Kontoen din er nå opprettet. Du er klar til å ta i bruk Frilansportalen!
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
