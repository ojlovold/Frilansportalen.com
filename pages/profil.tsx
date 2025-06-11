// pages/profil.tsx
"use client";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function ProfilSide() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiler")
          .select("id, navn, telefon, adresse, postnummer, poststed, fodselsdato, kjonn, nasjonalitet, rolle, bilde, om_meg, cv, epost")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Feil ved henting av profil:", error);
          setStatus("❌ Kunne ikke hente profilinfo");
        } else {
          setProfil(data);
        }
      } catch (err) {
        console.error("Uventet feil:", err);
        setStatus("❌ Uventet feil ved henting av profil");
      }
    };

    hentProfil();
  }, [user, supabase]);

  const oppdaterFelt = (felt: string, verdi: string) => {
    setProfil((p: any) => ({ ...p, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!user || !profil) return;
    setStatus("Lagrer...");
    const { error } = await supabase.from("profiler").update(profil).eq("id", user.id);
    if (error) setStatus("❌ Feil: " + error.message);
    else setStatus("✅ Lagret");
  };

  if (!profil) return <div className="p-6 text-white">Laster profilinformasjon...</div>;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <Head><title>Min profil</title></Head>

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-[#1c1c1e] rounded-xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 border border-gray-700">
          <div className="w-full md:w-1/3">
            <div className="w-full aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-600">
              {profil.bilde ? (
                <Image src={profil.bilde} alt="Profilbilde" width={400} height={400} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Ingen bilde</div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{profil.navn || "Navn mangler"}</h1>
            <div className="flex gap-3 mb-4">
              {profil.rolle?.split(",").map((r: string) => (
                <span key={r} className="px-3 py-1 bg-yellow-600 text-black font-semibold text-xs rounded-full shadow">
                  {r.trim()}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm mb-1">{profil.epost}</p>
            <p className="text-gray-400 text-sm mb-4">{profil.nasjonalitet}</p>

            <textarea
              value={profil.om_meg || ""}
              onChange={(e) => oppdaterFelt("om_meg", e.target.value)}
              placeholder="Om meg..."
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1c1c1e] p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Kontakt og personalia</h2>
            <div className="space-y-3">
              <input value={profil.telefon || ""} onChange={(e) => oppdaterFelt("telefon", e.target.value)} placeholder="Telefon" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
              <input value={profil.adresse || ""} onChange={(e) => oppdaterFelt("adresse", e.target.value)} placeholder="Adresse" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
              <input value={profil.postnummer || ""} onChange={(e) => oppdaterFelt("postnummer", e.target.value)} placeholder="Postnummer" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
              <input value={profil.poststed || ""} onChange={(e) => oppdaterFelt("poststed", e.target.value)} placeholder="Poststed" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
              <input value={profil.fodselsdato || ""} onChange={(e) => oppdaterFelt("fodselsdato", e.target.value)} type="date" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
              <input value={profil.kjonn || ""} onChange={(e) => oppdaterFelt("kjonn", e.target.value)} placeholder="Kjønn" className="w-full p-3 bg-gray-900 border border-gray-700 rounded" />
            </div>
          </div>

          <div className="bg-[#1c1c1e] p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">CV og erfaring</h2>
            <textarea
              value={profil.cv || ""}
              onChange={(e) => oppdaterFelt("cv", e.target.value)}
              placeholder="Din erfaring, utdanning og prosjekter..."
              className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded resize-none"
            />
          </div>
        </div>

        <div className="bg-[#1c1c1e] p-6 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Galleri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 h-32 rounded-lg flex items-center justify-center text-gray-500">
              Kommer snart...
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={lagre} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-xl shadow-xl">
            Lagre endringer
          </button>
          {status && <p className="mt-3 text-sm text-white/80">{status}</p>}
        </div>
      </div>
    </main>
  );
}
