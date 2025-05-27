// pages/admin/logginnstillinger.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import Head from "next/head";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Logginnstillinger() {
  const [loggAlt, setLoggAlt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("admin_config")
      .select("logg_alt")
      .single()
      .then(({ data }) => {
        if (data) setLoggAlt(data.logg_alt);
        setLoading(false);
      });
  }, []);

  const toggleLogging = async () => {
    setLoading(true);
    await supabase.from("admin_config").update({ logg_alt: !loggAlt }).neq("logg_alt", null);
    setLoggAlt(!loggAlt);
    setLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Logginnstillinger | Frilansportalen</title>
      </Head>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Logginnstillinger</h1>
        {loading ? (
          <p>Laster...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded shadow">
              <span>Logg alle adminhandlinger</span>
              <button
                onClick={toggleLogging}
                className={`px-4 py-1 rounded font-semibold ${loggAlt ? "bg-green-600 text-white" : "bg-gray-300"}`}
              >
                {loggAlt ? "På" : "Av"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
