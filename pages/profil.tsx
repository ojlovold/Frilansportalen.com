// pages/profil.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";

export default function ProfilVisning() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [omMeg, setOmMeg] = useState("");

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiler").select("*").eq("id", user.id).single();
      if (data) {
        setProfil(data);
        setOmMeg(data.om_meg || "");
      }
    };
    hent();
  }, [user]);

  const lagreOmMeg = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiler").update({ om_meg: omMeg }).eq("id", user.id);
    if (error) setStatus("❌ Kunne ikke lagre");
    else setStatus("✅ Lagret!");
  };

  if (!profil) return <div className="p-6">Laster profil...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black">
      <Head><title>Min profil | Frilansportalen</title></Head>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur p-6 mt-10 rounded-xl shadow-xl">
        <div className="flex items-center gap-6 mb-6">
          {profil.bilde && (
            <img src={profil.bilde} alt="Profilbilde" className="w-32 h-32 object-cover rounded-full border-4 border-white shadow" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{profil.navn}</h1>
            <p className="text-sm text-gray-600">{profil.rolle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Telefon:</strong> {profil.telefon}</p>
            <p><strong>E-post:</strong> {profil.epost}</p>
            <p><strong>Fødselsdato:</strong> {profil.fodselsdato}</p>
          </div>
          <div>
            <p><strong>Adresse:</strong> {profil.adresse}</p>
            <p><strong>Postnummer:</strong> {profil.postnummer} {profil.poststed}</p>
            <p><strong>Nasjonalitet:</strong> {profil.nasjonalitet}</p>
            <p><strong>Kjønn:</strong> {profil.kjonn}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Om meg</label>
          <textarea
            value={omMeg}
            onChange={(e) => setOmMeg(e.target.value)}
            rows={5}
            className="w-full p-3 rounded border border-gray-300"
          />
          <button
            onClick={lagreOmMeg}
            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Lagre tekst
          </button>
          {status && <p className="mt-2 text-sm text-center">{status}</p>}
        </div>
      </div>
    </main>
  );
}
