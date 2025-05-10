import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Samtykke() {
  const [deling, setDeling] = useState(true);
  const [ai, setAi] = useState(true);
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
        setDeling(data.samtykke_deling ?? true);
        setAi(data.samtykke_ai ?? true);
      }
    };

    hent();
  }, [router]);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    await supabase.from("profiler").update({
      samtykke_deling: deling,
      samtykke_ai: ai,
    }).eq("id", id);

    setLagret(true);
  };

  return (
    <Layout>
      <Head>
        <title>Samtykke | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Samtykke</h1>

      <div className="max-w-lg space-y-4 text-sm">
        <label>
          <input
            type="checkbox"
            checked={deling}
            onChange={(e) => setDeling(e.target.checked)}
            className="mr-2"
          />
          Tillat at profilen min kan vises for arbeidsgivere (standard)
        </label>

        <label>
          <input
            type="checkbox"
            checked={ai}
            onChange={(e) => setAi(e.target.checked)}
            className="mr-2"
          />
          Tillat at AI-assistenten bruker mine data til å gi meg bedre hjelp
        </label>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Lagre samtykke
        </button>

        {lagret && <p className="text-green-700 text-sm">Innstillinger lagret.</p>}
      </div>
    </Layout>
  );
}
