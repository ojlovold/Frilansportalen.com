// pages/admin/logg.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import Layout from "../../components/Layout";
import { loggAdminHandling } from "@/lib/adminLogger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoggSide() {
  const [logg, setLogg] = useState<any[]>([]);

  useEffect(() => {
    const hentOgLogg = async () => {
      await loggAdminHandling("ole@frilansportalen.com", "Åpnet adminlogg");
      const { data } = await supabase
        .from("admin_logg")
        .select("*")
        .order("tidspunkt", { ascending: false });
      if (data) setLogg(data);
    };
    hentOgLogg();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Adminlogg | Frilansportalen</title>
      </Head>
      <div className="p-6 bg-portalGul min-h-screen max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Adminlogg</h1>
        <ul className="space-y-4">
          {logg.map((entry) => (
            <li key={entry.id} className="bg-white p-4 rounded shadow">
              <p><strong>{entry.epost}</strong> – {new Date(entry.tidspunkt).toLocaleString()}</p>
              <p className="text-gray-700">{entry.handling}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
