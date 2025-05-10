import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Arkiv() {
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

  if (loading) return <Layout><p className="text-sm">Laster arkiv...</p></Layout>;

  const filer = [
    { navn: "Kontrakt_Oppdrag_Stavanger.pdf", type: "PDF", dato: "01.05.2025" },
    { navn: "Kvittering_faktura_421.jpg", type: "Bilde", dato: "28.04.2025" },
    { navn: "Arbeidsattest.docx", type: "Word", dato: "12.03.2025" },
  ];

  return (
    <Layout>
      <Head>
        <title>Arkiv | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Ditt dokumentarkiv</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Filnavn</th>
            <th className="p-2">Type</th>
            <th className="p-2">Dato</th>
            <th className="p-2">Handling</th>
          </tr>
        </thead>
        <tbody>
          {filer.map(({ navn, type, dato }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{navn}</td>
              <td className="p-2">{type}</td>
              <td className="p-2">{dato}</td>
              <td className="p-2 space-x-2">
                <a href="#" className="underline text-blue-600 hover:text-blue-800">Last ned</a>
                <a href="#" className="underline text-blue-600 hover:text-blue-800">Send igjen</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
