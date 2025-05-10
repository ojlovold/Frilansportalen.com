import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Innstillinger() {
  const [data, setData] = useState<any>({});
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data: profil } = await supabase
        .from("profiler")
        .select("*")
        .eq("id", id)
        .single();

      if (profil) setData(profil);
    };

    hent();
  }, []);

  const oppdater = (felt: string, verdi: any) => {
    setData((prev: any) => ({ ...prev, [felt]: verdi }));
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase
      .from("profiler")
      .update(data)
      .eq("id", id);

    setMelding(error ? "Feil under lagring" : "Innstillinger lagret.");
  };

  return (
    <Layout>
      <Head>
        <title>Innstillinger | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-sm">
        <h1 className="text-2xl font-bold mb-6">Innstillinger og kontroll</h1>

        <div className="space-y-4">
          <input
            value={data.firmanavn || ""}
            onChange={(e) => oppdater("firmanavn", e.target.value)}
            placeholder="Firmanavn"
            className="w-full p-2 border rounded"
          />
          <input
            value={data.orgnr || ""}
            onChange={(e) => oppdater("orgnr", e.target.value)}
            placeholder="Organisasjonsnummer"
            className="w-full p-2 border rounded"
          />
          <input
            value={data.adresse || ""}
            onChange={(e) => oppdater("adresse", e.target.value)}
            placeholder="Adresse"
            className="w-full p-2 border rounded"
          />
          <input
            value={data.poststed || ""}
            onChange={(e) => oppdater("poststed", e.target.value)}
            placeholder="Poststed"
            className="w-full p-2 border rounded"
          />
          <input
            value={data.kontonr || ""}
            onChange={(e) => oppdater("kontonr", e.target.value)}
            placeholder="Kontonummer"
            className="w-full p-2 border rounded"
          />
          <input
            value={data.fakturareferanse || ""}
            onChange={(e) => oppdater("fakturareferanse", e.target.value)}
            placeholder="Fakturareferanse"
            className="w-full p-2 border rounded"
          />

          <label className="block">
            <input
              type="checkbox"
              checked={data.samtykke_ai ?? true}
              onChange={(e) => oppdater("samtykke_ai", e.target.checked)}
              className="mr-2"
            />
            Tillat AI å gi forslag basert på mine data
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={data.samtykke_deling ?? true}
              onChange={(e) => oppdater("samtykke_deling", e.target.checked)}
              className="mr-2"
            />
            Tillat at profilen kan vises for andre
          </label>

          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Lagre innstillinger
          </button>

          {melding && <p className="text-green-600 mt-2">{melding}</p>}
        </div>
      </div>
    </Layout>
  );
}
