import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Avslutt() {
  const [klar, setKlar] = useState(false);
  const router = useRouter();

  const avslutt = async () => {
    const bekreft = confirm("Er du sikker på at du vil avslutte abonnementet og slette kontoen?");
    if (!bekreft) return;

    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    await supabase.from("profiler").delete().eq("id", id);
    await supabase.auth.signOut();

    setKlar(true);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  return (
    <Layout>
      <Head>
        <title>Avslutt konto | Frilansportalen</title>
      </Head>

      <div className="max-w-lg mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Avslutt og slett konto</h1>

        {klar ? (
          <p className="text-green-600 text-sm">Kontoen er slettet. Du blir sendt til forsiden.</p>
        ) : (
          <>
            <p className="mb-6 text-sm">
              Ved å trykke nedenfor avslutter du abonnementet ditt og sletter profilen din
              permanent. Dette kan ikke angres.
            </p>

            <button
              onClick={avslutt}
              className="bg-red-700 text-white px-4 py-2 rounded text-sm hover:bg-red-800"
            >
              Slett konto og avslutt abonnement
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
