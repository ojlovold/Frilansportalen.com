import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Personlig() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const [cv, kontrakter, meldinger] = await Promise.all([
        supabase.from("cv").select("fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("kontrakter").select("fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("meldinger").select("tekst, tidspunkt").eq("fra", id),
      ]);

      const samlet = [
        ...(cv.data || []).map((f) => ({ type: "CV", fil: f.fil, dato: f.opprettet_dato })),
        ...(kontrakter.data || []).map((f) => ({ type: "Kontrakt", fil: f.fil, dato: f.opprettet_dato })),
        ...(meldinger.data || []).map((m) => ({ type: "Melding", tekst: m.tekst, dato: m.tidspunkt })),
      ];

      setData(samlet);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Min oversikt | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Min personlige oversikt</h1>

        {data.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen innhold funnet.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {data.map((d, i) => (
              <li key={i} className="bg-white border p-4 rounded shadow-sm">
                <p className="text-xs text-gray-500 mb-1">{new Date(d.dato).toLocaleString("no-NO")}</p>
                {d.type === "Melding" ? (
                  <p>{d.tekst}</p>
                ) : (
                  <p>
                    {d.type}:{" "}
                    <Link href={d.fil} target="_blank" className="underline text-blue-600 hover:text-blue-800">
                      Åpne fil
                    </Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
