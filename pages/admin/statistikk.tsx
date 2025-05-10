import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Statistikk() {
  const [stat, setStat] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      const [brukere, meldinger, faktura, tjenester, varsler] = await Promise.all([
        supabase.from("profiler").select("id"),
        supabase.from("meldinger").select("id"),
        supabase.from("fakturaer").select("id"),
        supabase.from("tjenester").select("id"),
        supabase.from("varsler").select("id"),
      ]);

      setStat({
        brukere: brukere.data?.length || 0,
        meldinger: meldinger.data?.length || 0,
        faktura: faktura.data?.length || 0,
        tjenester: tjenester.data?.length || 0,
        varsler: varsler.data?.length || 0,
      });

      setLoading(false);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Statistikk | Admin | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Systemstatistikk</h1>

      {loading ? (
        <p className="text-sm">Laster systemdata...</p>
      ) : (
        <ul className="text-sm space-y-3 bg-white border border-black p-6 rounded max-w-md">
          <li>
            <strong>Registrerte brukere:</strong> {stat.brukere}
          </li>
          <li>
            <strong>Sendte meldinger:</strong> {stat.meldinger}
          </li>
          <li>
            <strong>Opprettede fakturaer:</strong> {stat.faktura}
          </li>
          <li>
            <strong>Publiserte tjenester:</strong> {stat.tjenester}
          </li>
          <li>
            <strong>Systemvarsler sendt:</strong> {stat.varsler}
          </li>
        </ul>
      )}
    </Layout>
  );
}
