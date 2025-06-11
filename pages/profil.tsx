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
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    const hentProfil = async () => {
      const { data } = await supabase.from("profiler").select("*").eq("id", user.id).single();
      setProfil(data || {});
    };
    hentProfil();
  }, [user]);

  const oppdaterFelt = (felt: string, verdi: string) => {
    setProfil((p: any) => ({ ...p, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!user) return;
    setStatus("Lagrer...");
    const { error } = await supabase.from("profiler").update(profil).eq("id", user.id);
    if (error) setStatus("❌ Feil: " + error.message);
    else setStatus("✅ Lagret");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head><title>Min profil</title></Head>

      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 items-start flex-wrap">
          <div className="w-64 h-64 bg-white/80 rounded-xl shadow-xl overflow-hidden border border-black/10">
            {profil.bilde ? (
              <Image src={profil.bilde} alt="Profilbilde" width={300} height={300} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Ingen bilde</div>
            )}
          </div>

          <div className="flex-1 bg-white/90 backdrop-blur p-6 rounded-xl shadow-xl border border-black/10">
            <h1 className="text-3xl font-bold mb-2">{profil.navn || "Navn mangler"}</h1>
            <p className="text-sm text-black/60">{profil.epost}</p>

            <textarea
              value={profil.om_meg || ""}
              onChange={(e) => oppdaterFelt("om_meg", e.target.value)}
              placeholder="Skriv noe om deg selv..."
              className="w-full mt-4 p-3 border border-gray-300 rounded resize-none h-24"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-4 rounded-xl shadow-xl">
            <h2 className="font-bold text-lg mb-2">Personalia</h2>
            <div className="space-y-2">
              <input value={profil.telefon || ""} onChange={(e) => oppdaterFelt("telefon", e.target.value)} placeholder="Telefon" className="w-full p-2 border rounded" />
              <input value={profil.adresse || ""} onChange={(e) => oppdaterFelt("adresse", e.target.value)} placeholder="Adresse" className="w-full p-2 border rounded" />
              <input value={profil.postnummer || ""} onChange={(e) => oppdaterFelt("postnummer", e.target.value)} placeholder="Postnummer" className="w-full p-2 border rounded" />
              <input value={profil.poststed || ""} onChange={(e) => oppdaterFelt("poststed", e.target.value)} placeholder="Poststed" className="w-full p-2 border rounded" />
              <input value={profil.kjonn || ""} onChange={(e) => oppdaterFelt("kjonn", e.target.value)} placeholder="Kjønn" className="w-full p-2 border rounded" />
              <input value={profil.fodselsdato || ""} onChange={(e) => oppdaterFelt("fodselsdato", e.target.value)} placeholder="Fødselsdato" type="date" className="w-full p-2 border rounded" />
              <input value={profil.nasjonalitet || ""} onChange={(e) => oppdaterFelt("nasjonalitet", e.target.value)} placeholder="Nasjonalitet" className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl shadow-xl">
            <h2 className="font-bold text-lg mb-2">CV og roller</h2>
            <textarea
              value={profil.cv || ""}
              onChange={(e) => oppdaterFelt("cv", e.target.value)}
              placeholder="Beskriv din erfaring, utdanning og relevante prosjekter..."
              className="w-full h-48 p-3 border rounded resize-none"
            />

            <input
              value={profil.rolle || ""}
              onChange={(e) => oppdaterFelt("rolle", e.target.value)}
              placeholder="Roller / kompetanseområder"
              className="w-full mt-4 p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-8 bg-white/80 p-4 rounded-xl shadow-xl">
          <h2 className="font-bold text-lg mb-2">Galleri</h2>
          <p className="text-sm mb-2 text-black/60">Flere bilder kommer her senere</p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={lagre}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Lagre endringer
          </button>
          {status && <p className="mt-2 text-sm">{status}</p>}
        </div>
      </div>
    </main>
  );
}
