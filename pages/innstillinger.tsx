import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Innstillinger() {
  const [språk, setSpråk] = useState("no");
  const [modus, setModus] = useState("lys");
  const [tilgjengelighet, setTilgjengelighet] = useState(false);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      if (data) {
        setSpråk(data.språk ?? "no");
        setModus(data.modus ?? "lys");
        setTilgjengelighet(data.tilgjengelighet ?? false);
      }
    };

    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase
      .from("profiler")
      .update({ språk, modus, tilgjengelighet })
      .eq("id", id);

    if (error) {
      setMelding("Feil under lagring");
    } else {
      setMelding("Innstillinger lagret");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Innstillinger | Frilansportalen</title>
      </Head>

      <div className="max-w-lg mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Innstillinger</h1>

        <div className="space-y-4 text-sm">
          <label className="block">
            Språk:
            <select
              value={språk}
              onChange={(e) => setSpråk(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="no">Norsk</option>
              <option value="en">English</option>
              <option value="sv">Svenska</option>
              <option value="da">Dansk</option>
            </select>
          </label>

          <label className="block">
            Visningsmodus:
            <select
              value={modus}
              onChange={(e) => setModus(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="lys">Lys</option>
              <option value="mørk">Mørk</option>
            </select>
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={tilgjengelighet}
              onChange={(e) => setTilgjengelighet(e.target.checked)}
              className="mr-2"
            />
            Aktiver tale-til-tekst og større tekst
          </label>

          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Lagre
          </button>

          {melding && <p className="text-green-600 mt-2">{melding}</p>}
        </div>
      </div>
    </Layout>
  );
}
