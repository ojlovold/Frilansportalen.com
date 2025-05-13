import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Sikkerhet() {
  const [brukerinfo, setBrukerinfo] = useState<any>(null);
  const [samtykkeAI, setSamtykkeAI] = useState(true);
  const [samtykkeDeling, setSamtykkeDeling] = useState(true);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!data?.user) {
        console.warn("Ingen innlogget bruker funnet");
        return;
      }

      setBrukerinfo(data.user);

      const { data: profil } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profil) {
        setSamtykkeAI(profil.samtykke_ai ?? true);
        setSamtykkeDeling(profil.samtykke_deling ?? true);
      }
    };

    hent();
  }, []);

  const lagre = async () => {
    if (!brukerinfo?.id) {
      setMelding("Brukerinfo mangler. Prøv å laste siden på nytt.");
      return;
    }

    const { error } = await supabase
      .from("profiler")
      .update({ samtykke_ai: samtykkeAI, samtykke_deling: samtykkeDeling })
      .eq("id", brukerinfo.id);

    setMelding(error ? "Kunne ikke lagre." : "Oppdatert.");
  };

  return (
    <Layout>
      <Head>
        <title>Sikkerhet og samtykke | Frilansportalen</title>
      </Head>

      <div className="max-w-lg mx-auto py-10 text-sm">
        <h1 className="text-2xl font-bold mb-6">Sikkerhet og samtykke</h1>

        <p className="mb-4">
          Din innlogging: <strong>{brukerinfo?.email || "Ikke innlogget"}</strong>
        </p>

        <div className="mb-6 space-y-3">
          <label className="block">
            <input
              type="checkbox"
              checked={samtykkeAI}
              onChange={(e) => setSamtykkeAI(e.target.checked)}
              className="mr-2"
            />
            Jeg samtykker til at AI kan gi forslag basert på mine data
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={samtykkeDeling}
              onChange={(e) => setSamtykkeDeling(e.target.checked)}
              className="mr-2"
            />
            Jeg samtykker til at profilen min kan deles med relevante parter
          </label>

          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Lagre
          </button>

          {melding && <p className="text-green-600 mt-3">{melding}</p>}
        </div>
      </div>
    </Layout>
  );
}
