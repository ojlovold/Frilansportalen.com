import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Brukerinnstillinger() {
  const [språk, setSpråk] = useState("no");
  const [modus, setModus] = useState("lys");
  const [tilgjengelighet, setTilgjengelighet] = useState(false);
  const [lagret, setLagret] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      if (data) {
        setSpråk(data.språk || "no");
        setModus(data.modus || "lys");
        setTilgjengelighet(data.tilgjengelighet || false);
      }
    };

    hent();
  }, [router]);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    await supabase.from("profiler").update({ språk, modus, tilgjengelighet }).eq("id", id);
    setLagret(true);
  };

  return (
    <Layout>
      <Head>
        <title>Innstillinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Brukerinnstillinger</h1>

      <div className="max-w-lg space-y-4">
        <label className="block text-sm">
          Språk:
          <select
            value={språk}
            onChange={(e) => setSpråk(e.target.value)}
            className="p-2 border rounded w-full mt-1"
          >
            <option value="no">Norsk</option>
            <option value="en">Engelsk</option>
          </select>
        </label>

        <label className="block text-sm">
          Visningsmodus:
          <select
            value={modus}
            onChange={(e) => setModus(e.target.value)}
            className="p-2 border rounded w-full mt-1"
          >
            <option value="lys">Lys modus</option>
            <option value="mørk">Mørk modus</option>
          </select>
        </label>

        <label className="block text-sm">
          <input
            type="checkbox"
            checked={tilgjengelighet}
            onChange={(e) => setTilgjengelighet(e.target.checked)}
            className="mr-2"
          />
          Aktiver utvidet tilgjengelighet (tale, større tekst)
        </label>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Lagre innstillinger
        </button>

        {lagret && <p className="text-sm text-green-700">Endringer lagret.</p>}
      </div>
    </Layout>
  );
}
