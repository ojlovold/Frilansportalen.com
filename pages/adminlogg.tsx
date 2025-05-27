import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Adminlogg() {
  const [loading, setLoading] = useState(true);
  const [logg, setLogg] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const sjekkInnlogging = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        const { data: loggData } = await supabase
          .from("admin_logg")
          .select("*")
          .order("tidspunkt", { ascending: false });

        setLogg(loggData || []);
        setLoading(false);
      }
    };
    sjekkInnlogging();
  }, [router]);

  if (loading)
    return (
      <Layout>
        <p className="text-sm">Laster adminlogg...</p>
      </Layout>
    );

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
          {logg.map((entry, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">
                {new Date(entry.tidspunkt).toLocaleString("no-NO")}
              </td>
              <td className="p-2">{entry.epost}</td>
              <td className="p-2">{entry.handling}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
