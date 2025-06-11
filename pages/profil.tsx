// pages/profil.tsx
"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";

export default function Profil() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [omMeg, setOmMeg] = useState("");
  const [ekstraBilder, setEkstraBilder] = useState<File[]>([]);
  const [visning, setVisning] = useState(true);

  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiler").select("*")

        .eq("id", user.id).single();
      if (data) {
        setData(data);
        setOmMeg(data.om_meg || "");
      }
    };
    hentProfil();
  }, [user]);

  const lagreOmMeg = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiler").update({ om_meg: omMeg }).eq("id", user.id);
    setStatus(error ? "❌ Feil" : "✅ Lagret");
  };

  const lastOppEkstraBilder = async () => {
    if (!user || ekstraBilder.length === 0) return;
    const urls: string[] = [];
    for (const bilde of ekstraBilder) {
      const filnavn = `${user.id}/galleri/${Date.now()}_${bilde.name}`;
      const { error } = await supabase.storage.from("profilbilder").upload(filnavn, bilde, {
        upsert: false,
        contentType: bilde.type || "image/jpeg"
      });
      if (!error) {
        const url = supabase.storage.from("profilbilder").getPublicUrl(filnavn).data.publicUrl;
        urls.push(url);
      }
    }
    const { error } = await supabase.from("profiler").update({ ekstra_bilder: urls }).eq("id", user.id);
    setStatus(error ? "❌ Feil ved opplasting" : "✅ Bilder lagret");
  };

  if (!user) return <div className="p-8">Laster bruker...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-400 via-yellow-300 to-yellow-100 text-black p-6">
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white/90 p-6 rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={data?.bilde || "/default.jpg"}
            alt="Profilbilde"
            className="w-32 h-32 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold">{data?.navn}</h1>
            <p className="text-sm text-gray-600">{data?.epost}</p>
            <p className="text-sm">📞 {data?.telefon}</p>
            <p className="text-sm">🎂 {data?.fodselsdato}</p>
            <p className="text-sm">🏳️ {data?.nasjonalitet}</p>
            <p className="text-sm">📍 {data?.adresse}, {data?.postnummer} {data?.poststed}</p>
            <p className="text-sm">👤 {data?.kjonn}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(data?.roller || [])?.split(',').map((r: string, i: number) => (
                <span key={i} className="bg-yellow-200 text-black text-xs px-2 py-1 rounded-full">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold mb-2">Om meg</h2>
        {visning ? (
          <div className="bg-gray-100 p-4 rounded mb-4 whitespace-pre-line">
            {data?.om_meg || "Ingen tekst lagt inn ennå."}
          </div>
        ) : (
          <textarea
            value={omMeg}
            onChange
