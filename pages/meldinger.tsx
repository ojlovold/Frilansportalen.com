import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Meldinger() {
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const brukerId = bruker.data.user?.id;

      if (!brukerId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("meldinger")
        .select("fra, til, melding, tidspunkt")
        .or(`fra.eq.${brukerId},til.eq.${brukerId}`)
        .order("tidspunkt", { ascending: false });

      if (!error && data) {
        setMeldinger(data);
      }

      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster meldinger...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Meldinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Dine samtaler</h1>

      {meldinger.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen meldinger funnet.</p>
      ) : (
        <ul className="space-y-4 bg-white border border-black rounded p-4 text-sm">
          {meldinger.map(({ fra, til, melding, tidspunkt }, i) => (
            <li key={i}>
              <strong>{tidspunkt.split("T")[0]}</strong> – {melding}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
