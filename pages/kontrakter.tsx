import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Kontrakter() {
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

  if (loading) return <Layout><p className="text-sm">Laster kontrakter...</p></Layout>;

  const kontrakter = [
    { navn: "Oppdrag Oslo", motpart: "MediaHuset", status: "Venter på signatur" },
    { navn: "Designjobb Stavanger", motpart: "Kari AS", status: "Signert" },
  ];

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
            <th className="p-2">Handling</th>
          </tr>
        </thead>
        <tbody>
          {kontrakter.map(({ navn, motpart, status }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{navn}</td>
              <td className="p-2">{motpart}</td>
              <td className="p-2">{status}</td>
              <td className="p-2 space-x-2">
                <Link href="#" className="underline text-blue-600 hover:text-blue-800">Signer</Link>
                <Link href="#" className="underline text-blue-600 hover:text-blue-800">Se</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
