import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Logg() {
  const [logg, setLogg] = useState<any[]>([]);
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

      const [meldinger, faktura, tjenester] = await Promise.all([
        supabase.from("meldinger").select("id, tidspunkt").eq("fra", id),
        supabase.from("fakturaer").select("id, opprettet_dato").eq("opprettet_av", id),
        supabase.from("tjenester").select("id, opprettet_dato").eq("opprettet_av", id),
      ]);

      const samlet = [
        ...(meldinger.data || []).map((r) => ({
          type: "Melding sendt",
          dato: r.tidspunkt,
        })),
        ...(faktura.data || []).map((r) => ({
          type: "Faktura opprettet",
          dato: r.opprettet_dato,
        })),
        ...(tjenester.data || []).map((r) => ({
          type: "Tjeneste publisert",
          dato: r.opprettet_dato,
        })),
      ].sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime());

      setLogg(samlet);
      setLoading(false);
    };

    hent();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Min logg | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Min aktivitetslogg</h1>

      {loading ? (
        <p className="text-sm">Laster logg...</p>
      ) : logg.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen registrert aktivitet.</p>
      ) : (
        <ul className="text-sm space-y-2">
          {logg.map((l, i) => (
            <li key={i}>
              <strong>{l.type}</strong> – {new Date(l.dato).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
