import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Kontrakter() {
  const [kontrakter, setKontrakter] = useState<any[]>([]);
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
        .from("kontrakter")
        .select("id, navn, motpart, status, fil")
        .eq("opprettet_av", brukerId)
        .order("opprettet_dato", { ascending: false });

      if (!error && data) {
        setKontrakter(data);
      }

      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster kontrakter...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Kontrakter | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Kontrakter</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Navn</th>
            <th className="p-2">Motpart</th>
            <th className="p-2">Status</th>
            <th className="p-2">Fil</th>
          </tr>
        </thead>
        <tbody>
          {kontrakter.map(({ id, navn, motpart, status, fil }) => (
            <tr key={id} className="border-t border-black">
              <td className="p-2">{navn}</td>
              <td className="p-2">{motpart}</td>
              <td className="p-2">{status}</td>
              <td className="p-2">
                {fil ? (
                  <a href={fil} target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-800">
                    Last ned
                  </a>
                ) : (
                  <span className="text-gray-500 text-xs">Ingen fil</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8">
        <Link href="/kontrakter/ny-kontrakt" className="underline text-sm hover:text-black">
          Last opp ny kontrakt
        </Link>
      </div>
    </Layout>
  );
}
