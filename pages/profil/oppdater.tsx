import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import SuccessBox from "../../components/SuccessBox";

export default function OppdaterProfil() {
  const [profil, setProfil] = useState<any>({});
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      if (data) setProfil(data);
    };
    hent();
  }, []);

  const endre = (felt: string, verdi: any) => {
    setProfil((prev: any) => ({ ...prev, [felt]: verdi }));
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;

    const { error } = await supabase.from("profiler").update(profil).eq("id", id);
    setMelding(error ? "Kunne ikke lagre" : "Profil oppdatert");
  };

  return (
    <Layout>
      <Head><title>Oppdater profil</title></Head>
      <div className="max-w-xl mx-auto py-10 text-sm">
        <h1 className="text-2xl font-bold mb-6">Oppdater profil</h1>

        <input
          value={profil.navn || ""}
          onChange={(e) => endre("navn", e.target.value)}
          placeholder="Navn"
          className="w-full p-2 border rounded mb-4"
        />

        <select
          value={profil.rolle || ""}
          onChange={(e) => endre("rolle", e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Velg rolle</option>
          <option value="frilanser">Frilanser</option>
          <option value="jobbsøker">Jobbsøker</option>
        </select>

        <input
          type="number"
          value={profil.timespris || ""}
          onChange={(e) => endre("timespris", parseFloat(e.target.value))}
          placeholder="Din timespris (kr)"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Lagre
        </button>

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
