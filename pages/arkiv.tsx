import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Arkiv() {
  const [filer, setFiler] = useState<any[]>([]);
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
        .from("fakturaer")
        .select("til, belop, fil, opprettet_dato")
        .eq("opprettet_av", brukerId)
        .not("fil", "is", null)
        .order("opprettet_dato", { ascending: false });

      if (!error && data) {
        setFiler(data);
      }

      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster dokumenter...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Arkiv | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Dokumentarkiv</h1>

      {filer.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen filer funnet.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Mottaker</th>
              <th className="p-2">Beløp</th>
              <th className="p-2">Fil</th>
              <th className="p-2">Handling</th>
            </tr>
          </thead>
          <tbody>
            {filer.map(({ til, belop, fil }, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{til}</td>
                <td className="p-2">{belop} kr</td>
                <td className="p-2 text-xs break-all">{fil}</td>
                <td className="p-2 space-x-2">
                  <a href={fil} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">Last ned</a>
                  <button onClick={() => navigator.clipboard.writeText(fil)} className="underline text-blue-600 hover:text-blue-800 text-xs">
                    Kopier lenke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
