import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Profil() {
  const [navn, setNavn] = useState("");
  const [bilde, setBilde] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      if (data) {
        setNavn(data.navn || "");
        setBilde(data.bilde || "");
      }
    };

    hent();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Min profil</h1>

      <div className="max-w-lg space-y-4 bg-white border border-black p-6 rounded">
        {bilde && (
          <img src={bilde} alt="Profilbilde" className="w-32 h-32 rounded-full object-cover" />
        )}
        <p><strong>Navn:</strong> {navn || "–"}</p>
      </div>
    </Layout>
  );
}
