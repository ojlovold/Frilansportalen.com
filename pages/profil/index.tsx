"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";

export default function Profilside() {
  const user = useUser();
  const [profil, setProfil] = useState<any>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (data) {
        setProfil({
          ...data,
          roller: Array.isArray(data.roller)
            ? data.roller
            : typeof data.roller === "string"
            ? [data.roller]
            : [],
          bilder: Array.isArray(data.bilder) ? data.bilder : [],
        });
      } else {
        setProfil({ id: user?.id, epost: user?.email });
      }
    };

    if (user?.id) hent();
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
    if (!e.target.files || !e.target.files.length || !user) return;
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

  if (!user) return <div className="p-6 text-white">🔒 Du må være innlogget</div>;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Head><title>Min profil</title></Head>
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Min profil</h1>

        {/* Navn og kontakt */}
        <input
          value={profil.navn || ""}
          onChange={(e) => endre("navn", e.target.value)}
          placeholder="Navn"
          className="w-full p-3 border rounded text-black"
        />
        <input
          value={profil.epost || ""}
          onChange={(e) => endre("epost", e.target.value)}
          placeholder="E-post"
          className="w-full p-3 border rounded text-black"
        />

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
        <textarea
          value={profil.om_meg || ""}
          onChange={(e) => endre("om_meg", e.target.value)}
          placeholder="Om meg"
          className="w-full p-3 border rounded h-32 text-black"
        />
        <textarea
          value={profil.cv || ""}
          onChange={(e) => endre("cv", e.target.value)}
          placeholder="CV, utdanning, erfaring..."
          className="w-full p-3 border rounded h-40 text-black"
        />

        {/* Profilbilde */}
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

        {/* Lagre */}
        <button
          onClick={lagre}
          className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Lagre endringer
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </div>
    </main>
  );
}
