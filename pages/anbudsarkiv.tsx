import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Anbudsarkiv() {
  const [anbud, setAnbud] = useState<any[]>([]);
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
        .from("anbud")
        .select("*")
        .eq("opprettet_av", id)
        .order("opprettet_dato", { ascending: false });

      setAnbud(data || []);
      setLoading(false);
    };

    hent();
  }, [router]);

  const total = anbud.reduce((sum, a) => sum + (a.total || 0), 0);

  return (
    <Layout>
      <Head>
        <title>Anbudsarkiv | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Anbudsarkiv</h1>

      {loading ? (
        <p className="text-sm">Laster arkiv...</p>
      ) : anbud.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen anbud registrert ennå.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-8">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Dato</th>
              <th className="p-2">Timer</th>
              <th className="p-2">Timepris</th>
              <th className="p-2">Reisekost</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {anbud.map((a, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{a.opprettet_dato?.split("T")[0]}</td>
                <td className="p-2">{a.timer}</td>
                <td className="p-2">{a.timepris} kr</td>
                <td className="p-2">{a.reise} kr</td>
                <td className="p-2 font-semibold">{a.total} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-right text-sm font-semibold">
        Totalt kalkulert: {total.toFixed(2)} kr
      </p>
    </Layout>
  );
}
