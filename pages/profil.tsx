// pages/profil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";

export default function Profil() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("");

  const hentProfil = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiler").select("*").eq("id", user.id).single();
    setProfil(data);
  };

  useEffect(() => {
    hentProfil();
  }, [user]);

  const oppdaterFelt = (felt: string, verdi: any) => {
    setProfil((prev: any) => ({ ...prev, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!profil || !user) return;
    setStatus("Lagrer...");
    const { error } = await supabase.from("profiler").update(profil).eq("id", user.id);
    setStatus(error ? "❌ " + error.message : "✅ Lagret");
  };

  if (!profil) return <div className="p-6">Laster...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] p-6 text-black">
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Min profil</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <label>
            Navn:
            <input value={profil.navn || ""} onChange={e => oppdaterFelt("navn", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Telefonnummer:
            <input value={profil.telefon || ""} onChange={e => oppdaterFelt("telefon", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Adresse:
            <input value={profil.adresse || ""} onChange={e => oppdaterFelt("adresse", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Postnummer:
            <input value={profil.postnummer || ""} onChange={e => oppdaterFelt("postnummer", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Poststed:
            <input value={profil.poststed || ""} onChange={e => oppdaterFelt("poststed", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Fødselsdato:
            <input type="date" value={profil.fodselsdato || ""} onChange={e => oppdaterFelt("fodselsdato", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Kjønn:
            <select value={profil.kjonn || ""} onChange={e => oppdaterFelt("kjonn", e.target.value)} className="w-full p-2 border rounded">
              <option value="">Velg...</option>
              <option value="kvinne">Kvinne</option>
              <option value="mann">Mann</option>
              <option value="ikke-binær">Ikke-binær</option>
              <option value="transperson">Transperson</option>
              <option value="annet">Annet</option>
              <option value="vil ikke oppgi">Vil ikke oppgi</option>
            </select>
          </label>

          <label>
            Nasjonalitet:
            <input value={profil.nasjonalitet || ""} onChange={e => oppdaterFelt("nasjonalitet", e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label className="md:col-span-2">
            Om meg:
            <textarea value={profil.om_meg || ""} onChange={e => oppdaterFelt("om_meg", e.target.value)} className="w-full p-2 border rounded h-32" />
          </label>
        </div>

        <button onClick={lagre} className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Lagre endringer
        </button>
        {status && <p className="mt-4 text-sm text-center">{status}</p>}
      </div>
    </main>
  );
}
