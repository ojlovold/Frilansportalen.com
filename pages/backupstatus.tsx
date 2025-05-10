import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Backupstatus() {
  const [poster, setPoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("backupstatus")
        .select("*")
        .order("tidspunkt", { ascending: false })
        .limit(10);

      setPoster(data || []);
      setLoading(false);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Backupstatus | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Backupstatus</h1>

      {loading ? (
        <p className="text-sm">Laster backupdata...</p>
      ) : poster.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen backupregistreringer ennå.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-8">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Tidspunkt</th>
              <th className="p-2">Status</th>
              <th className="p-2">Detaljer</th>
            </tr>
          </thead>
          <tbody>
            {poster.map((p, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{p.tidspunkt?.split("T")[0]}</td>
                <td className="p-2 font-semibold">{p.status}</td>
                <td className="p-2">{p.detaljer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
