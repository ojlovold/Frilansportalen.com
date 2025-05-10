import Head from "next/head";
import Layout from "../components/Layout";
import PdfExport from "../components/PdfExport";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Faktura() {
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hentFaktura = async () => {
      const bruker = await supabase.auth.getUser();
      const brukerId = bruker.data.user?.id;

      if (!brukerId) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("fakturaer")
        .select("*")
        .eq("opprettet_av", brukerId)
        .order("opprettet_dato", { ascending: false });

      setFakturaer(data || []);
      setLoading(false);
    };

    hentFaktura();
  }, [router]);

  const kolonner = ["Faktura #", "Til", "Beløp", "Status"];
  const rader = fakturaer.map((f, i) => [
    `F${String(i + 1).padStart(4, "0")}`,
    f.til,
    `${f.belop} kr`,
    f.status,
  ]);

  return (
    <Layout>
      <Head>
        <title>Fakturaer | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Fakturaoversikt</h1>

      {loading ? (
        <p className="text-sm">Laster fakturaer...</p>
      ) : fakturaer.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen fakturaer registrert.</p>
      ) : (
        <>
          <table className="w-full text-sm border border-black bg-white mb-6">
            <thead>
              <tr className="bg-black text-white text-left">
                <th className="p-2">Faktura #</th>
                <th className="p-2">Til</th>
                <th className="p-2">Beløp</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {fakturaer.map((f, i) => (
                <tr key={i} className="border-t border-black">
                  <td className="p-2">F{String(i + 1).padStart(4, "0")}</td>
                  <td className="p-2">{f.til}</td>
                  <td className="p-2">{f.belop} kr</td>
                  <td className="p-2">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <PdfExport
              tittel="Fakturaoversikt"
              filnavn="faktura"
              kolonner={kolonner}
              rader={rader}
            />
          </div>
        </>
      )}
    </Layout>
  );
}
