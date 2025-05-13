import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Head from "next/head";
import Layout from "@/components/Layout";
import supabase from "@/lib/supabaseClient";
import loggVisning from "@/lib/loggVisning";

export default function StillingsVisning() {
  const router = useRouter();
  const { id } = router.query;

  const rawUser = useUser();
  const user = rawUser as unknown as User | null;

  const [stilling, setStilling] = useState<any>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [laster, setLaster] = useState(true);

  useEffect(() => {
    const hentStilling = async () => {
      if (!id || typeof id !== "string") return;

      const { data, error } = await supabase
        .from("stillinger")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Feil ved henting:", error);
        setFeil("Kunne ikke finne stillingen.");
      } else {
        setStilling(data);
      }

      setLaster(false);
    };

    hentStilling();
  }, [id]);

  useEffect(() => {
    if (user?.id && stilling?.id) {
      loggVisning(user.id, stilling.id, "stilling");
    }
  }, [user, stilling]);

  return (
    <Layout>
      <Head>
        <title>{stilling?.tittel || "Stilling"} | Frilansportalen</title>
      </Head>

      {laster ? (
        <p>Laster stillingsannonse...</p>
      ) : feil ? (
        <p className="text-red-600">{feil}</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{stilling.tittel}</h1>
          <p className="text-sm text-gray-700 mb-6">{stilling.beskrivelse}</p>
          {/* Tilpass og utvid visningen etter behov */}
        </>
      )}
    </Layout>
  );
}
