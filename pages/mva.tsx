import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function MVA() {
  const [oversikt, setOversikt] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("mva")
        .select("*")
        .eq("bruker_id", id)
        .order("måned", { ascending: false });

      setOversikt(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>MVA | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">MVA-rapport</h1>

        {oversikt.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen MVA-data registrert.</p>
        ) : (
          <table className="w-full border text-sm bg-white">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-2 text-left">Måned</th>
                <th className="p-2 text-right">Inntekt</th>
                <th className="p-2 text-right">Fradrag</th>
                <th className="p-2 text-right">MVA (25%)</th>
              </tr>
            </thead>
            <tbody>
              {oversikt.map((m, i) => (
                <tr key={i} className="border-t text-right">
                  <td className="p-2 text-left">{m.måned}</td>
                  <td className="p-2">{m.inntekt.toFixed(2)}</td>
                  <td className="p-2">{m.fradrag.toFixed(2)}</td>
                  <td className="p-2">{((m.inntekt - m.fradrag) * 0.25).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
