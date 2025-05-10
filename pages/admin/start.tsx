import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Start() {
  const [aktiv, setAktiv] = useState(false);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("backupstatus")
        .select("*")
        .order("tidspunkt", { ascending: false })
        .limit(1);
      const status = data?.[0]?.status || "inaktiv";
      setAktiv(status === "aktiv");
    };

    hent();
  }, []);

  const startPortalen = async () => {
    await supabase.from("backupstatus").insert({
      status: "aktiv",
      detaljer: "Lanseringsknapp trykket av eier",
    });
    setAktiv(true);
  };

  return (
    <Layout>
      <Head>
        <title>Start portalen | Admin</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Start Frilansportalen</h1>

      {aktiv ? (
        <p className="text-green-600 text-sm">
          Portalen er allerede lansert og aktiv.
        </p>
      ) : (
        <button
          onClick={startPortalen}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Start portalen
        </button>
      )}
    </Layout>
  );
}
