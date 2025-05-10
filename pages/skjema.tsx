import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Skjema() {
  const [skjema, setSkjema] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("skjemabank").select("*").order("opprettet_dato", { ascending: false });
      setSkjema(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Skjemabank | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Skjemabank</h1>

        {skjema.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen skjema publisert ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {skjema.map((s, i) => (
              <li key={i} className="bg-white border rounded p-4 shadow-sm">
                <p className="font-semibold">{s.tittel}</p>
                <p className="text-gray-600 text-xs mb-1">
                  {new Date(s.opprettet_dato).toLocaleDateString("no-NO")}
                </p>
                <p>{s.beskrivelse}</p>
                {s.fil && (
                  <Link href={s.fil} target="_blank" className="text-xs underline text-blue-600 hover:text-blue-800">
                    Last ned
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
