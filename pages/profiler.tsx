"use client";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Profiler() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [profil, setProfil] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const hentProfil = async () => {
      const { data, error } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setStatus("❌ Fant ikke profil");
      } else {
        setProfil({
          ...data,
          bilder: Array.isArray(data.bilder) ? data.bilder : [],
          roller: Array.isArray(data.roller)
            ? data.roller
            : typeof data.roller === "string"
            ? [data.roller]
            : [],
        });
      }
    };
    hentProfil();
  }, [user]);

  const oppdaterFelt = (felt: string, verdi: any) => {
    setProfil((p: any) => ({ ...p, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!user || !profil) return;
    setStatus("Lagrer...");

    const payload = {
      ...profil,
      roller: Array.isArray(profil.roller) ? profil.roller : [],
      bilder: Array.isArray(profil.bilder) ? profil.bilder : [],
    };

    const { error } = await supabase.from("profiler").update(payload).eq("id", user.id);
    setStatus(error ? `❌ Feil: ${error.message}` : "✅ Lagret");
  };

  const lastOppBilde = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || !user) return;
    const fil = event.target.files[0];
    const filnavn = `${user.id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from("profilbilder")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) {
      return setStatus("❌ Opplasting feilet");
    }

    const { data: urlData } = supabase.storage
      .from("profilbilder")
      .getPublicUrl(filnavn);

    const url = urlData?.publicUrl;
    if (url) {
      const nye = [...(profil.bilder || []), url];
      oppdaterFelt("bilde", url);
      oppdaterFelt("bilder", nye);
      setStatus("✅ Bilde lastet opp (husk å lagre)");
    }
  };

  if (!user) return <div className="p-6 text-white">🔒 Du må være logget inn.</div>;
  if (!profil) return <div className="p-6 text-white">⏳ Laster profil...</div>;

  return (
    <main className="min-h-screen bg-[#1f1f1f] text-white p-6">
      <Head><title>Min profil</title></Head>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* TOPPSEKSJON */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 w-full flex flex-col items-center">
            <div className="aspect-square w-full rounded-xl border border-gray-700 overflow-hidden">
              {profil.bilde ? (
                <Image src={profil.bilde} alt="Profilbilde" width={400} height={400} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-800">Ingen bilde</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={lastOppBilde} className="mt-2 text-sm w-full" />
          </div>

          <div className="flex-1 space-y-3">
            <input
              value={profil.navn || ""}
              onChange={(e) => oppdaterFelt("navn", e.target.value)}
              placeholder="Navn"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white text-xl font-semibold"
            />
            <input
              value={profil.epost || ""}
              onChange={(e) => oppdaterFelt("epost", e.target.value)}
              placeholder="E-post"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
            <input
              value={profil.poststed || ""}
              onChange={(e) => oppdaterFelt("poststed", e.target.value)}
              placeholder="Sted"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
          </div>
        </div>

        {/* ROLLESEKSJON */}
        <div className="bg-[#222] border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Roller</h2>
          <div className="grid grid-cols-2 gap-3">
            {["frilanser", "jobbsøker", "arbeidsgiver", "tilbyder"].map((rolle) => (
              <label key={rolle} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={profil.roller.includes(rolle)}
                  onChange={(e) => {
                    const ny = e.target.checked
                      ? [...profil.roller, rolle]
                      : profil.roller.filter((r: string) => r !== rolle);
                    oppdaterFelt("roller", ny);
                  }}
                />
                <span>{rolle}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CV */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">CV</h2>
          <textarea
            value={profil.cv || ""}
            onChange={(e) => oppdaterFelt("cv", e.target.value)}
            placeholder="Skriv inn erfaring, utdanning, prosjekter..."
            className="w-full h-48 p-3 bg-gray-900 border border-gray-700 rounded resize-none text-white"
          />
        </div>

        {/* PERSONALIA */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Personalia</h2>
          {["fodselsdato", "kjonn", "nasjonalitet"].map((felt) => (
            <input
              key={felt}
              value={profil[felt] || ""}
              onChange={(e) => oppdaterFelt(felt, e.target.value)}
              type={felt === "fodselsdato" ? "date" : "text"}
              placeholder={felt}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
          ))}
        </div>

        {/* GALLERI */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Galleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profil.bilder.map((url: string, i: number) => (
              <div key={i} className="relative">
                <img src={url} alt={`Bilde ${i + 1}`} className="w-full h-40 object-cover rounded border border-gray-600" />
                <button
                  onClick={() => {
                    const nye = profil.bilder.filter((b: string) => b !== url);
                    oppdaterFelt("bilder", nye);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Lim inn bilde-URL"
            onBlur={(e) => {
              const url = e.target.value.trim();
              if (url && !profil.bilder.includes(url)) {
                oppdaterFelt("bilder", [...profil.bilder, url]);
              }
            }}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
          />
        </div>

        {/* OM MEG */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Om meg</h2>
          <textarea
            value={profil.om_meg || ""}
            onChange={(e) => oppdaterFelt("om_meg", e.target.value)}
            placeholder="Fortell litt om deg selv..."
            className="w-full h-40 p-3 bg-gray-900 border border-gray-700 rounded resize-none text-white"
          />
        </div>

        {/* LAGRE */}
        <div className="text-center">
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
