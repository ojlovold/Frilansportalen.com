import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import SuccessBox from "../../components/SuccessBox";
import TilgjengelighetEditor from "../../components/TilgjengelighetEditor";

export default function OppdaterProfil() {
  const [profil, setProfil] = useState<any>({});
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
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
      }
    };
    hent();
  }, []);

  const endre = (felt: string, verdi: any) => {
    setProfil((prev: any) => ({ ...prev, [felt]: verdi }));
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;

    const { error } = await supabase
      .from("profiler")
      .update(profil)
      .eq("id", id);

    setMelding(error ? "Kunne ikke lagre" : "✅ Profil oppdatert");
  };

  const lastOppBilde = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!event.target.files?.length || !id) return;

    const fil = event.target.files[0];
    const filnavn = `${id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from("profilbilder")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) return setMelding("❌ Opplasting feilet");

    const { data } = supabase.storage.from("profilbilder").getPublicUrl(filnavn);
    const url = data?.publicUrl;
    if (url) {
      const nye = [...(profil.bilder || []), url];
      endre("bilde", url);
      endre("bilder", nye);
      setMelding("✅ Bilde lastet opp – husk å lagre");
    }
  };

  return (
    <Layout>
      <Head><title>Oppdater profil</title></Head>
      <div className="max-w-3xl mx-auto py-10 space-y-6 text-sm">
        <h1 className="text-2xl font-bold mb-2">Oppdater profil</h1>

        <input
          value={profil.navn || ""}
          onChange={(e) => endre("navn", e.target.value)}
          placeholder="Navn"
          className="w-full p-3 border rounded"
        />

        <input
          value={profil.epost || ""}
          onChange={(e) => endre("epost", e.target.value)}
          placeholder="E-post"
          className="w-full p-3 border rounded"
        />

        <div className="border p-4 rounded">
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

        <input
          type="number"
          value={profil.timespris || ""}
          onChange={(e) => endre("timespris", parseFloat(e.target.value))}
          placeholder="Timespris (kr)"
          className="w-full p-3 border rounded"
        />

        <textarea
          value={profil.om_meg || ""}
          onChange={(e) => endre("om_meg", e.target.value)}
          placeholder="Om meg"
          className="w-full p-3 border rounded h-32"
        />

        <textarea
          value={profil.cv || ""}
          onChange={(e) => endre("cv", e.target.value)}
          placeholder="CV, erfaring, utdanning"
          className="w-full p-3 border rounded h-40"
        />

        <div className="space-y-2">
          <p className="font-semibold">Profilbilde</p>
          {profil.bilde && (
            <img src={profil.bilde} alt="Profilbilde" className="w-40 h-40 object-cover rounded border" />
          )}
          <input type="file" accept="image/*" onChange={lastOppBilde} />
        </div>

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

        {/* Tilgjengelighet */}
        <div className="mt-10">
          <TilgjengelighetEditor
            onEndre={async (ny) => {
              const bruker = await supabase.auth.getUser();
              const id = bruker.data.user?.id;
              for (const oppføring of ny) {
                await supabase.from("tilgjengelighet").insert([{ id, ...oppføring }]);
              }
              setMelding("✅ Tilgjengelighet lagret");
            }}
          />
        </div>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Lagre endringer
        </button>

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
