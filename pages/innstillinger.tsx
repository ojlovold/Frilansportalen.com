import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Innstillinger() {
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

  if (loading) return <Layout><p className="text-sm">Laster innstillinger...</p></Layout>;

  const orgnr = "935 411 343";
  const portaltittel = "Frilansportalen";
  const kontakt = "ole@frilansportalen.com";

  return (
    <Layout>
      <Head>
        <title>Innstillinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Portalinnstillinger</h1>

      <div className="grid gap-4 text-sm bg-white border border-black rounded p-4 max-w-lg">
        <div>
          <label className="block font-semibold">Portaltittel:</label>
          <input
            type="text"
            value={portaltittel}
            className="w-full mt-1 p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Organisasjonsnummer:</label>
          <input
            type="text"
            value={orgnr}
            className="w-full mt-1 p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Kontakt-e-post:</label>
          <input
            type="email"
            value={kontakt}
            className="w-full mt-1 p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <p className="text-gray-600 mt-4">(Disse innstillingene er registrert og låst av administrator.)</p>
      </div>
    </Layout>
  );
}
