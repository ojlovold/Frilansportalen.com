import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Startside() {
  const [publisert, setPublisert] = useState(false);
  const [lastet, setLastet] = useState(false);
  const [statusId, setStatusId] = useState("");

  useEffect(() => {
    const hentStatus = async () => {
      const { data, error } = await supabase.from("systemstatus").select("id, publisert").limit(1).single();
      if (!error && data) {
        setStatusId(data.id);
        setPublisert(data.publisert);
      }
      setLastet(true);
    };
    hentStatus();
  }, []);

  const publiser = async () => {
    if (!statusId) return;

    const bekreft = confirm("Er du sikker på at du vil publisere Frilansportalen?");
    if (!bekreft) return;

    const { error } = await supabase
      .from("systemstatus")
      .update({ publisert: true, sist_endret: new Date().toISOString() })
      .eq("id", statusId);

    if (!error) setPublisert(true);
  };

  return (
    <Layout>
      <Head>
        <title>Start Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Lansering av Frilansportalen</h1>

        {!lastet ? (
          <p>Laster publiseringsstatus...</p>
        ) : publisert ? (
          <p className="text-green-600 text-sm">Frilansportalen er publisert for offentligheten.</p>
        ) : (
          <button
            onClick={publiser}
            className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
          >
            Publiser Frilansportalen nå
          </button>
        )}
      </div>
    </Layout>
  );
}
