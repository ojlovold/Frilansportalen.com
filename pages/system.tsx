import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Systemstatus() {
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

  if (loading) return <Layout><p className="text-sm">Laster systemstatus...</p></Layout>;

  const produksjonAktiv = true;
  const backupAktiv = true;
  const vipps = false;
  const stripe = false;

  return (
    <Layout>
      <Head>
        <title>Systemstatus | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Systemstatus og overvåking</h1>

      <ul className="text-sm space-y-4 bg-white border border-black p-4 rounded">
        <li>
          <strong>Produksjonsmodus:</strong>{" "}
          <span className={produksjonAktiv ? "text-green-700" : "text-red-700"}>
            {produksjonAktiv ? "AKTIV" : "STANDBY"}
          </span>
        </li>
        <li>
          <strong>Backupportal:</strong>{" "}
          <span className={backupAktiv ? "text-green-700" : "text-red-700"}>
            {backupAktiv ? "TILKOBLET" : "UTILGJENGELIG"}
          </span>
        </li>
        <li>
          <strong>Vipps:</strong>{" "}
          <span className={vipps ? "text-green-700" : "text-red-700"}>
            {vipps ? "AKTIVERT" : "IKKE AKTIV"}
          </span>
        </li>
        <li>
          <strong>Stripe:</strong>{" "}
          <span className={stripe ? "text-green-700" : "text-red-700"}>
            {stripe ? "AKTIVERT" : "IKKE AKTIV"}
          </span>
        </li>
      </ul>
    </Layout>
  );
}
