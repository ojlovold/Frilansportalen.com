// pages/profil.tsx
"use client";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function ProfilSide() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [profil, setProfil] = useState<any>({});
  const [status, setStatus] = useState("Laster...");

  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiler")
          .select("id, navn, telefon, adresse, postnummer, poststed, fodselsdato, kjonn, nasjonalitet, rolle, bilde, om_meg, cv, epost")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          console.warn("Ingen data funnet eller feil:", error);
          setProfil({ id: user.id, epost: user.email });
          setStatus("Ny profil");
        } else {
          setProfil(data);
          setStatus("");
        }
      } catch (err) {
        console.error("Uventet feil:", err);
        setStatus("❌ Feil ved henting");
      }
    };

    hentProfil();
  }, [user, supabase]);

  const oppdaterFelt = (felt: string, verdi: string) => {
    setProfil((p: any) => ({ ...p, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!user) return;
    setStatus("Lagrer...");
    const { error } = await supabase
      .from("profiler")
      .upsert({ ...profil, id: user.id });
    if (error) setStatus("❌ Feil: " + error.message);
    else setStatus("✅ Lagret");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1f1f1f] via-[#2b2b2b] to-[#1f1f1f] text-white p-6">
      <Head><title>Min profil</title></Head>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profil</h1>

        <div className="flex flex-wrap gap-6">
          <div className="w-64 h-64 rounded-lg overflow-hidden border border-gray-600 bg-gray-800 flex items-center justify-center shadow-lg">
            {profil.bilde ? (
              <Image
                src={profil.bilde}
                alt="Profilbilde"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">Ingen bilde</span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <input value={profil.navn || ""} onChange={(e) => oppdaterFelt("navn", e.target.value)} placeholder="Navn" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" />
            <input value={profil.epost || ""} onChange={(e) => oppdaterFelt("epost", e.target.value)} placeholder="E-post" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" />
            <textarea value={profil.om_meg || ""} onChange={(e) => oppdaterFelt("om_meg", e.target.value)} placeholder="Om meg" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#222] p-4 rounded-xl border border-gray-700 space-y-3">
            <h2 className="text-lg font-semibold mb-2">Personalia</h2>
            <input value={profil.telefon || ""} onChange={(e) => oppdaterFelt("telefon", e.target.value)} placeholder="Telefon" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.adresse || ""} onChange={(e) => oppdaterFelt("adresse", e.target.value)} placeholder="Adresse" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.postnummer || ""} onChange={(e) => oppdaterFelt("postnummer", e.target.value)} placeholder="Postnummer" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.poststed || ""} onChange={(e) => oppdaterFelt("poststed", e.target.value)} placeholder="Poststed" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.kjonn || ""} onChange={(e) => oppdaterFelt("kjonn", e.target.value)} placeholder="Kjønn" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.fodselsdato || ""} onChange={(e) => oppdaterFelt("fodselsdato", e.target.value)} type="date" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.nasjonalitet || ""} onChange={(e) => oppdaterFelt("nasjonalitet", e.target.value)} placeholder="Nasjonalitet" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
          </div>

          <div className="bg-[#222] p-4 rounded-xl border border-gray-700 space-y-3">
            <h2 className="text-lg font-semibold mb-2">CV og roller</h2>
            <textarea value={profil.cv || ""} onChange={(e) => oppdaterFelt("cv", e.target.value)} placeholder="CV, erfaring, utdanning" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            <input value={profil.rolle || ""} onChange={(e) => oppdaterFelt("rolle", e.target.value)} placeholder="Roller / kompetanse" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={lagre}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-xl"
          >
            Lagre endringer
          </button>
          {status && <p className="mt-3 text-white/80">{status}</p>}
        </div>
      </div>
    </main>
  );
}
