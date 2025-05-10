import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Analyse() {
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

  if (loading) return <Layout><p className="text-sm">Laster analyse...</p></Layout>;

  const sisteHandlinger = [
    { tid: "13:47", bruker: "Kari AS", aktivitet: "Sendte melding" },
    { tid: "13:42", bruker: "Jonas B", aktivitet: "La ut ny tjeneste" },
    { tid: "13:39", bruker: "Ole Gründer", aktivitet: "Signerte kontrakt" },
  ];

  return (
    <Layout>
      <Head>
        <title>Analyse | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Sanntidsaktivitet</h1>

      <ul className="bg-white border border-black rounded p-4 text-sm space-y-3">
        {sisteHandlinger.map(({ tid, bruker, aktivitet }, i) => (
          <li key={i}>
            <strong>{tid}</strong> – <span className="text-blue-800">{bruker}</span> {aktivitet}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-500 mt-4">
        * Dette er et statisk eksempel. Sanntidslogging kan kobles til systemet senere.
      </p>
    </Layout>
  );
}
