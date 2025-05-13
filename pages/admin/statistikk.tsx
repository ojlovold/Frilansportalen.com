import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabaseClient";

type Stat = {
  stillinger: number;
  meldinger: number;
  faktura: number;
  varsler: number;
};

export default function Statistikk() {
  const user = useUser() as unknown as User; // ← Dette løser feilen
  const [stat, setStat] = useState<Stat>({
    stillinger: 0,
    meldinger: 0,
    faktura: 0,
    varsler: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;

      const [stillinger, meldinger, faktura, varsler] = await Promise.all([
        supabase.from("stillinger").select("id").eq("arbeidsgiver_id", user.id),
        supabase.from("meldinger").select("id").eq("fra", user.id),
        supabase.from("fakturaer").select("id").eq("fra_id", user.id),
        supabase.from("varsler").select("id").eq("bruker_id", user.id),
      ]);

      setStat({
        stillinger: stillinger.data?.length || 0,
        meldinger: meldinger.data?.length || 0,
        faktura: faktura.data?.length || 0,
        varsler: varsler.data?.length || 0,
      });

      setLoading(false);
    };

    hent();
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>Statistikk | Arbeidsgiver | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Min statistikk</h1>

      {loading ? (
        <p className="text-sm">Laster statistikk...</p>
      ) : (
        <ul className="text-sm space-y-3 bg-white border border-black p-6 rounded max-w-md">
          <li>
            <strong>Stillingsannonser:</strong> {stat.stillinger}
          </li>
          <li>
            <strong>Sendte meldinger:</strong> {stat.meldinger}
          </li>
          <li>
            <strong>Sendte fakturaer:</strong> {stat.faktura}
          </li>
          <li>
            <strong>Systemvarsler mottatt:</strong> {stat.varsler}
          </li>
        </ul>
      )}
    </Layout>
  );
}
