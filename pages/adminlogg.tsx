import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Adminlogg() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sjekkInnlogging = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    sjekkInnlogging();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster adminlogg...</p></Layout>;

  const logg = [
    { tid: "10.05.2025 08:03", bruker: "Ole Gründer", handling: "Trykket på Start lansering" },
    { tid: "10.05.2025 07:40", bruker: "System", handling: "Backup-portal verifisert OK" },
    { tid: "09.05.2025 23:15", bruker: "Admin", handling: "Publiserte stilling for MediaHuset" },
  ];

  return (
    <Layout>
      <Head>
        <title>Adminlogg | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Systemlogg</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Tid</th>
            <th className="p-2">Bruker</th>
            <th className="p-2">Handling</th>
          </tr>
        </thead>
        <tbody>
          {logg.map(({ tid, bruker, handling }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{tid}</td>
              <td className="p-2">{bruker}</td>
              <td className="p-2">{handling}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
