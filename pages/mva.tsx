import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Mva() {
  const [poster, setPoster] = useState<any[]>([]);
  const [periode, setPeriode] = useState("");
  const [omsetning, setOmsetning] = useState("");
  const [fradrag, setFradrag] = useState("");
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
        .from("mva")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      setPoster(data || []);
      setLoading(false);
    };

    hent();
  }, [router]);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const omset = parseFloat(omsetning);
    const frad = parseFloat(fradrag);
    const differanse = omset * 0.25 - frad;

    await supabase.from("mva").insert({
      bruker_id: id,
      periode,
      omsetning: omset,
      fradrag: frad,
      mva_oppgjør: differanse,
      levert: false,
    });

    setPeriode("");
    setOmsetning("");
    setFradrag("");
    router.reload();
  };

  const totalt = poster.reduce((sum, p) => sum + (p.mva_oppgjør || 0), 0);

  return (
    <Layout>
      <Head>
        <title>MVA | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">MVA-oppgjør</h1>

      <div className="max-w-lg space-y-4 mb-10">
        <input
          type="text"
          placeholder="Periode (f.eks. 1. termin 2025)"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          placeholder="Omsetning (kr)"
          value={omsetning}
          onChange={(e) => setOmsetning(e.target.value)}
          className="p-2 border rounded w-full"
          type="number"
        />
        <input
          placeholder="Fradrag (kr)"
          value={fradrag}
          onChange={(e) => setFradrag(e.target.value)}
          className="p-2 border rounded w-full"
          type="number"
        />
        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Lagre MVA-oppgjør
        </button>
      </div>

      {loading ? (
        <p className="text-sm">Laster MVA-data...</p>
      ) : poster.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen registrerte MVA-oppgjør ennå.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-8">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Periode</th>
              <th className="p-2">Omsetning</th>
              <th className="p-2">Fradrag</th>
              <th className="p-2">Å betale</th>
              <th className="p-2">Levert</th>
            </tr>
          </thead>
          <tbody>
            {poster.map((p, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{p.periode}</td>
                <td className="p-2">{p.omsetning} kr</td>
                <td className="p-2">{p.fradrag} kr</td>
                <td className="p-2 font-semibold">{p.mva_oppgjør?.toFixed(2)} kr</td>
                <td className="p-2">{p.levert ? "✔️" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-sm font-semibold text-right">
        Total MVA å betale: {totalt.toFixed(2)} kr
      </p>
    </Layout>
  );
}
