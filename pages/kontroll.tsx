// pages/kontroll.tsx
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Kontroll() {
  const [brukere, setBrukere] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: profiler } = await supabase.from("profiler").select("id, navn");
      const resultater: any[] = [];

      for (const p of profiler || []) {
        const [cv, kontrakter, attester] = await Promise.all([
          supabase.from("cv").select("id").eq("opprettet_av", p.id),
          supabase.from("kontrakter").select("id").eq("opprettet_av", p.id),
          supabase.from("attester").select("id").eq("bruker_id", p.id),
        ]);

        resultater.push({
          navn: p.navn,
          cv: !!cv?.data?.length,
          kontrakt: !!kontrakter?.data?.length,
          attest: !!attester?.data?.length,
        });
      }

      setBrukere(resultater);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Kontroll | Admin | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Manglende opplastinger</h1>

        {brukere.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen data funnet.</p>
        ) : (
          <table className="w-full text-sm border border-black bg-white">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-2 text-left">Navn</th>
                <th className="p-2">CV</th>
                <th className="p-2">Kontrakt</th>
                <th className="p-2">Attest</th>
              </tr>
            </thead>
            <tbody>
              {brukere.map((b, i) => (
                <tr key={i} className="border-t border-black text-center">
                  <td className="p-2 text-left">{b.navn}</td>
                  <td className="p-2">{b.cv ? "✔️" : "❌"}</td>
                  <td className="p-2">{b.kontrakt ? "✔️" : "❌"}</td>
                  <td className="p-2">{b.attest ? "✔️" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
