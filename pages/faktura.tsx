import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Faktura() {
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

  if (loading) return <Layout><p className="text-sm">Laster faktura...</p></Layout>;

  const fakturaer = [
    { nummer: "F2024-001", til: "Ola Hansen", beløp: "4 200 kr", status: "Betalt" },
    { nummer: "F2024-002", til: "Kari AS", beløp: "1 850 kr", status: "Sendt" },
    { nummer: "F2024-003", til: "Mekanisk Verksted", beløp: "9 300 kr", status: "Ubetalt" },
  ];

  return (
    <Layout>
      <Head>
        <title>Fakturaer | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Fakturaoversikt</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Faktura #</th>
            <th className="p-2">Til</th>
            <th className="p-2">Beløp</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {fakturaer.map(({ nummer, til, beløp, status }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{nummer}</td>
              <td className="p-2">{til}</td>
              <td className="p-2">{beløp}</td>
              <td className="p-2">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
