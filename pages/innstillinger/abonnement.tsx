import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Abonnement() {
  const [avsluttet, setAvsluttet] = useState(false);
  const router = useRouter();

  const avslutt = async () => {
    const bekreft = confirm("Er du sikker på at du vil avslutte abonnementet?");
    if (!bekreft) return;

    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) {
      router.push("/login");
      return;
    }

    // Marker bruker for avslutning
    await supabase.from("profiler").update({ aktiv_abonnement: false }).eq("id", id);
    setAvsluttet(true);
  };

  return (
    <Layout>
      <Head>
        <title>Abonnement | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Abonnement</h1>

      <p className="text-sm mb-4">
        Du har et aktivt abonnement. Hvis du ønsker å avslutte det, trykk på knappen under. Du vil
        beholde tilgang ut inneværende periode.
      </p>

      {avsluttet ? (
        <p className="text-green-700 text-sm">Abonnementet er avsluttet.</p>
      ) : (
        <button
          onClick={avslutt}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Avslutt abonnement
        </button>
      )}
    </Layout>
  );
}
