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

  const lastOppBilde = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const fil = event.target.files[0];
    const filnavn = `${user.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("profilbilder")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) {
      setStatus("❌ Feil ved opplasting: " + uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("profilbilder")
      .getPublicUrl(filnavn);

    const bildeUrl = data?.publicUrl;

    if (bildeUrl) {
      const { error: updateError } = await supabase
        .from("profiler")
        .update({ bilde: bildeUrl })
        .eq("id", user.id);

      if (updateError) {
        setStatus("❌ Klarte ikke å lagre bilde-URL: " + updateError.message);
      } else {
        setProfil((prev: any) => ({ ...prev, bilde: bildeUrl }));
        setStatus("✅ Bilde lastet opp og lagret!");
      }
    }
  };

  if (!profil) return <div className="p-6 text-white">Laster profilinformasjon...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1f1f1f] via-[#2b2b2b] to-[#1f1f1f] text-white p-6">
      <Head><title>Min profil</title></Head>

      <div className="max-w-6xl mx-auto">
        <div className="relative bg-[#333] rounded-xl shadow-xl overflow-hidden p-6 border border-gray-700">
          <div className="flex gap-6 items-start flex-wrap">
            <div className="w-64 h-64 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
              {profil.bilde ? (
                <Image
                  src={profil.bilde}
                  alt="Profilbilde"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                  Ingen bilde
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profil.navn || "Navn mangler"}</h1>
              <p className="text-sm text-gray-400 mb-4">{profil.epost}</p>

              <textarea
                value={profil.om_meg || ""}
                onChange={(e) => oppdaterFelt("om_meg", e.target.value)}
                placeholder="Skriv noe om deg selv..."
                className="w-full mt-4 p-3 border border-gray-700 rounded bg-gray-900 text-white"
              />
              <input
                type="file"
                accept="image/*"
                onChange={lastOppBilde}
                className="mt-4"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#222] p-6 rounded-xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Personalia</h2>
            <div className="space-y-3">
              <input value={profil.telefon || ""} onChange={(e) => oppdaterFelt("telefon", e.target.value)} placeholder="Telefon" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.adresse || ""} onChange={(e) => oppdaterFelt("adresse", e.target.value)} placeholder="Adresse" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.postnummer || ""} onChange={(e) => oppdaterFelt("postnummer", e.target.value)} placeholder="Postnummer" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.poststed || ""} onChange={(e) => oppdaterFelt("poststed", e.target.value)} placeholder="Poststed" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.kjonn || ""} onChange={(e) => oppdaterFelt("kjonn", e.target.value)} placeholder="Kjonn" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.fodselsdato || ""} onChange={(e) => oppdaterFelt("fodselsdato", e.target.value)} type="date" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
              <input value={profil.nasjonalitet || ""} onChange={(e) => oppdaterFelt("nasjonalitet", e.target.value)} placeholder="Nasjonalitet" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
            </div>
          </div>

          <div className="bg-[#222] p-6 rounded-xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">CV og roller</h2>
            <textarea
              value={profil.cv || ""}
              onChange={(e) => oppdaterFelt("cv", e.target.value)}
              placeholder="Din erfaring, utdanning, prosjekter..."
              className="w-full h-48 p-3 bg-gray-900 border border-gray-700 rounded resize-none text-white"
            />
            <input
              value={profil.rolle || ""}
              onChange={(e) => oppdaterFelt("rolle", e.target.value)}
              placeholder="Roller / kompetanseomrader"
              className="w-full mt-4 p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
          </div>
        </div>

        <div className="mt-8 bg-[#222] p-6 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Galleri</h2>
          <p className="text-sm text-gray-400">Her kommer dine opplastede bilder og medieinnhold...</p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={lagre}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-xl shadow-xl"
          >
            Lagre endringer
          </button>
          {status && <p className="mt-3 text-sm text-white/80">{status}</p>}
        </div>
      </div>
    </main>
  );
}
