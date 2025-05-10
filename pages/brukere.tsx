import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Brukere() {
  const [brukere, setBrukere] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("profiler").select("id, navn, bilde").order("navn", { ascending: true });
      if (data) setBrukere(data);
      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster brukere...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Brukere | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Registrerte brukere</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brukere.map(({ id, navn, bilde }) => (
          <div key={id} className="bg-white border border-black rounded p-4 text-sm flex items-center space-x-4">
            <img
              src={bilde || "/placeholder.png"}
              alt={navn || "Ukjent"}
              className="w-12 h-12 rounded-full object-cover bg-gray-200"
            />
            <span className="font-semibold">{navn || "Ukjent bruker"}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}
