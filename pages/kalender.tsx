import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Kalender() {
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

  if (loading) return <Layout><p className="text-sm">Laster kalender...</p></Layout>;

  const hendelser = [
    { dato: "12.05.2025", beskrivelse: "Oppdrag for MediaHuset (Oslo)" },
    { dato: "15.05.2025", beskrivelse: "Ledig" },
    { dato: "18.05.2025", beskrivelse: "Oppdrag: Festivalvakt (Bergen)" },
  ];

  return (
    <Layout>
      <Head>
        <title>Kalender | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Din kalender</h1>

      <ul className="text-sm bg-white border border-black rounded p-4 space-y-3">
        {hendelser.map(({ dato, beskrivelse }, i) => (
          <li key={i}>
            <strong>{dato}:</strong> {beskrivelse}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
