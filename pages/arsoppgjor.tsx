import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Arsoppgjor() {
  const [poster, setPoster] = useState<any[]>([]);
  const [år, setÅr] = useState(new Date().getFullYear());
  const [resultat, setResultat] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("arsoppgjor")
        .select("*")
        .eq("bruker_id", id)
        .order("år", { ascending: false });

      setPoster(data || []);
      setLoading(false);
    };

    hent();
  }, [router]);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const tall = parseFloat(resultat);

    await supabase.from("arsoppgjor").upsert({
      bruker_id: id,
      år,
      resultat: tall,
      levert: false,
    });

    setResultat("");
    router.reload();
  };

  const total = poster.reduce((sum, p) => sum + (p.resultat || 0), 0);

  return (
    <Layout>
      <Head>
        <title>Årsoppgjør | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Årsoppgjør</h1>

      <div className="max-w-lg space-y-4 mb-10">
        <input
          type="number"
          placeholder="Årstall"
          value={år}
          onChange={(e) => setÅr(Number(e.target.value))}
          className="p-2 border rounded w-full"
        />
        <input
          placeholder="Resultat (kr)"
          value={resultat}
          onChange={(e) => setResultat(e.target.value)}
          className="p-2 border rounded w-full"
          type="number"
        />
        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Lagre årsoppgjør
        </button>
      </div>

      {loading ? (
        <p className="text-sm">Laster årsoppgjør...</p>
      ) : poster.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen registrerte årsoppgjør ennå.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-8">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">År</th>
              <th className="p-2">Resultat</th>
              <th className="p-2">Levert</th>
              <th className="p-2">Dato</th>
            </tr>
          </thead>
          <tbody>
            {poster.map((p, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{p.år}</td>
                <td className="p-2">{p.resultat?.toFixed(2)} kr</td>
                <td className="p-2">{p.levert ? "✔️" : "❌"}</td>
                <td className="p-2">{p.levert_dato?.split("T")[0] || "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-sm font-semibold text-right">
        Total resultat: {total.toFixed(2)} kr
      </p>
    </Layout>
  );
}
