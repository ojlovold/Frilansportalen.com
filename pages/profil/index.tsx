"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";

export default function Profilside() {
  const user = useUser();
  const [profil, setProfil] = useState<any>({});
  const [status, setStatus] = useState("");
  const [tilgjengelighet, setTilgjengelighet] = useState<any[]>([]);
  const [valgtDato, setValgtDato] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;

      const { data: profildata } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: tider } = await supabase
        .from("tilgjengelighet")
        .select("*")
        .eq("id", user.id);

      setProfil({
        ...profildata,
        id: user.id,
        epost: user.email,
        roller: Array.isArray(profildata?.roller)
          ? profildata.roller
          : typeof profildata?.roller === "string"
          ? [profildata.roller]
          : [],
        bilder: Array.isArray(profildata?.bilder) ? profildata.bilder : [],
      });

      setTilgjengelighet(tider || []);
    };

    hent();
  }, [user]);

  const endre = (felt: string, verdi: any) => {
    setProfil((p: any) => ({ ...p, [felt]: verdi }));
  };

  const lagre = async () => {
    if (!profil?.id) return;
    setStatus("Lagrer...");
    const { error } = await supabase
      .from("profiler")
      .upsert(profil)
      .eq("id", profil.id);
    setStatus(error ? `❌ ${error.message}` : "✅ Lagret");
  };

  const lastOppBilde = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    const fil = e.target.files[0];
    const filnavn = `${user.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("profilbilder")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) return setStatus("❌ Opplasting feilet");

    const { data } = supabase.storage.from("profilbilder").getPublicUrl(filnavn);
    const url = data?.publicUrl;
    if (url) {
      const nye = [...(profil.bilder || []), url];
      endre("bilde", url);
      endre("bilder", nye);
      setStatus("✅ Bilde lastet opp – husk å lagre");
    }
  };

  const lagreTilgjengelighet = async (status: string) => {
    if (!valgtDato || !user?.id) return;

    const fra = "09:00:00";
    const til = "17:00:00";

    const { error } = await supabase
      .from("tilgjengelighet")
      .upsert({
        id: user.id,
        dato: valgtDato,
        fra_tid: fra,
        til_tid: til,
        status,
      });

    if (!error) {
      setTilgjengelighet((prev) => [
        ...prev.filter((e) => e.dato !== valgtDato),
        { id: user.id, dato: valgtDato, fra_tid: fra, til_tid: til, status },
      ]);
      setValgtDato(null);
    }
  };

  if (!user) return <div className="p-6 text-white">🔒 Du må være innlogget</div>;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Head><title>Min profil</title></Head>
      <div className="max-w-4xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Min profil</h1>

        <input value={profil.navn || ""} onChange={(e) => endre("navn", e.target.value)} placeholder="Navn" className="w-full p-3 border rounded text-black" />
        <input value={profil.epost || ""} onChange={(e) => endre("epost", e.target.value)} placeholder="E-post" className="w-full p-3 border rounded text-black" />

        {/* Roller */}
        <div className="border p-4 rounded bg-gray-900">
          <p className="font-semibold mb-2">Roller</p>
          <div className="grid grid-cols-2 gap-2">
            {["frilanser", "jobbsøker", "arbeidsgiver", "tilbyder"].map((rolle) => (
              <label key={rolle} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={profil.roller?.includes(rolle)}
                  onChange={(e) => {
                    const ny = e.target.checked
                      ? [...(profil.roller || []), rolle]
                      : (profil.roller || []).filter((r: string) => r !== rolle);
                    endre("roller", ny);
                  }}
                />
                <span>{rolle}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Personalia */}
        {["fodselsdato", "kjonn", "nasjonalitet", "adresse"].map((felt) => (
          <input
            key={felt}
            value={profil[felt] || ""}
            onChange={(e) => endre(felt, e.target.value)}
            placeholder={felt.charAt(0).toUpperCase() + felt.slice(1)}
            type={felt === "fodselsdato" ? "date" : "text"}
            className="w-full p-3 border rounded text-black"
          />
        ))}

        {/* Om meg og CV */}
        <textarea value={profil.om_meg || ""} onChange={(e) => endre("om_meg", e.target.value)} placeholder="Om meg" className="w-full p-3 border rounded h-32 text-black" />
        <textarea value={profil.cv || ""} onChange={(e) => endre("cv", e.target.value)} placeholder="CV, utdanning, erfaring..." className="w-full p-3 border rounded h-40 text-black" />

        {/* Bildeopplasting */}
        <div className="space-y-2">
          <p className="font-semibold">Profilbilde</p>
          {profil.bilde && (
            <img src={profil.bilde} alt="Profilbilde" className="w-32 h-32 object-cover rounded border" />
          )}
          <input type="file" accept="image/*" onChange={lastOppBilde} />
        </div>

        {/* Galleri */}
        <div className="space-y-2">
          <p className="font-semibold">Galleri</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profil.bilder?.map((url: string, i: number) => (
              <div key={i} className="relative">
                <img src={url} alt={`Bilde ${i}`} className="w-full h-32 object-cover rounded border" />
                <button
                  onClick={() => endre("bilder", profil.bilder.filter((b: string) => b !== url))}
                  className="absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-1 rounded"
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Tilgjengelighet – mobilvennlig */}
        <div className="bg-[#222] border border-gray-700 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Tilgjengelighet</h2>
          <input
            type="date"
            onChange={(e) => setValgtDato(e.target.value)}
            className="bg-black text-white border border-gray-600 rounded px-3 py-2 mb-3"
          />
          {valgtDato && (
            <div className="flex gap-3">
              <button
                onClick={() => lagreTilgjengelighet("ledig")}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Ledig
              </button>
              <button
                onClick={() => lagreTilgjengelighet("opptatt")}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
              >
                Opptatt
              </button>
              <button
                onClick={() => setValgtDato(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Avbryt
              </button>
            </div>
          )}
          <ul className="mt-4 text-sm text-gray-300">
            {tilgjengelighet.map((t) => (
              <li key={t.dato}>
                {t.dato}: {t.status === "ledig" ? "✅ Ledig" : "⛔ Opptatt"}
              </li>
            ))}
          </ul>
        </div>

        {/* Lagre */}
        <button onClick={lagre} className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300">
          Lagre endringer
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </div>
    </main>
  );
}
