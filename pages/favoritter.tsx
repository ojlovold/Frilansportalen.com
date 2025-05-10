import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Favoritter() {
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

  if (loading) return <Layout><p className="text-sm">Laster favoritter...</p></Layout>;

  const annonser = [
    { tittel: "Fotojobb i Ålesund", type: "Stillingsannonse" },
    { tittel: "Jonas B – Vaskehjelp", type: "Tjenestetilbyder" },
  ];

  const hurtigsvar = [
    "Hei, jeg er interessert!",
    "Er stillingen fortsatt ledig?",
    "Når ønskes oppstart?",
    "Kan vi ta en prat?",
  ];

  return (
    <Layout>
      <Head>
        <title>Favoritter og hurtigsvar | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Favoritter og hurtigsvar</h1>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Lagrede annonser</h2>
        <ul className="text-sm bg-white border border-black rounded p-4">
          {annonser.map(({ tittel, type }, i) => (
            <li key={i} className="mb-2">
              <strong>{tittel}</strong> <span className="text-gray-600">({type})</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Hurtigsvar</h2>
        <div className="flex flex-wrap gap-2">
          {hurtigsvar.map((svar, i) => (
            <button
              key={i}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
            >
              {svar}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
