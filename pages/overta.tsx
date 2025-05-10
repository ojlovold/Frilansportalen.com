import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Overta() {
  const [status, setStatus] = useState("");
  const [epost, setEpost] = useState("elise@lovold.no"); // standard for datter

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase
      .from("profiler")
      .update({ arving: epost })
      .eq("id", id);

    setStatus(error ? "Kunne ikke lagre." : "Arveregistering lagret.");
  };

  return (
    <Layout>
      <Head>
        <title>Overta Frilansportalen | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Digital overtakelse ved inaktivitet</h1>

        <p className="mb-4 text-sm text-gray-700">
          Hvis du er inaktiv i over 60 dager, vil Frilansportalen automatisk sende over
          en overtakelseslenke til den du har registrert under.
        </p>

        <input
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="E-post til ny administrator"
        />

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Lagre mottaker
        </button>

        {status && <p className="text-green-600 text-sm mt-4">{status}</p>}
      </div>
    </Layout>
  );
}
