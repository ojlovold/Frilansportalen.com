import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Filvarsling() {
  const [status, setStatus] = useState<{
    cv: boolean | null;
    kontrakt: boolean | null;
    attest: any[] | null;
  }>({
    cv: null,
    kontrakt: null,
    attest: null,
  });

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const [cv, kontrakt, attest] = await Promise.all([
        supabase.from("cv").select("id").eq("opprettet_av", id),
        supabase.from("kontrakter").select("id").eq("opprettet_av", id),
        supabase.from("attester").select("utløpsdato").eq("bruker_id", id),
      ]);

      setStatus({
        cv: Array.isArray(cv.data) && cv.data.length > 0,
        kontrakt: Array.isArray(kontrakt.data) && kontrakt.data.length > 0,
        attest: Array.isArray(attest.data) && attest.data.length > 0 ? attest.data : null,
      });
    };

    hent();
  }, []);

  const utløpsAdvarsel = () => {
    if (!status.attest) return null;
    const nærUt = status.attest.find((a: any) => {
      const dager =
        (new Date(a.utløpsdato).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return dager <= 30;
    });
    return nærUt ? "⚠️ Attest nær utløp" : null;
  };

  return (
    <Layout>
      <Head>
        <title>Mine dokumenter | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Dokumentstatus</h1>

        <ul className="space-y-4 text-sm">
          <li>
            CV:{" "}
            {status.cv ? (
              <span className="text-green-600">✔️ Lastet opp</span>
            ) : (
              <Link href="/cv" className="text-red-600 underline">
                ❌ Mangler – last opp
              </Link>
            )}
          </li>
          <li>
            Kontrakt:{" "}
            {status.kontrakt ? (
              <span className="text-green-600">✔️ Lagret</span>
            ) : (
              <Link href="/kontrakter" className="text-red-600 underline">
                ❌ Mangler – opprett
              </Link>
            )}
          </li>
          <li>
            Attester:{" "}
            {status.attest ? (
              <span className="text-green-600">
                ✔️ Lagt inn {utløpsAdvarsel() ? `– ${utløpsAdvarsel()}` : ""}
              </span>
            ) : (
              <Link href="/attester" className="text-red-600 underline">
                ❌ Mangler – last opp
              </Link>
            )}
          </li>
        </ul>
      </div>
    </Layout>
  );
}
