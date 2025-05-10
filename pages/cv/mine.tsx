import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function CVmine() {
  const [filer, setFiler] = useState<any[]>([]);
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

      const { data } = await supabase
        .from("cv")
        .select("fil, opprettet_dato")
        .eq("opprettet_av", id)
        .order("opprettet_dato", { ascending: false });

      if (data) setFiler(data);
      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster CV-er...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Mine CV-er | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Mine opplastede CV-er</h1>

      <ul className="text-sm bg-white border border-black rounded p-4 space-y-4">
        {filer.map(({ fil, opprettet_dato }, i) => (
          <li key={i}>
            {opprettet_dato?.split("T")[0]} –{" "}
            <a
              href={fil}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Last ned CV
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
