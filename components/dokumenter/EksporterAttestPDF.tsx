import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import LastOppAttest from "@/components/dokumenter/LastOppAttest";
import EksporterAttestPDF from "@/components/dokumenter/EksporterAttestPDF";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AttesterSide() {
  const user = useUser();
  const [attester, setAttester] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("attester")
        .select("*")
        .eq("bruker_id", user.id)
        .order("utløper");

      setAttester(data || []);
    };

    hent();
  }, [user]);

  if (!user) return <p>Du må være innlogget for å se attester.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Attester og dokumenter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <LastOppAttest brukerId={user.id} />

        <h2 className="text-xl font-bold">Mine attester</h2>

        {attester.length === 0 ? (
          <p>Ingen attester funnet.</p>
        ) : (
          <ul className="space-y-4">
            {attester.map((a) => (
              <li key={a.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Fil:</strong> <a href={a.url} target="_blank" className="underline text-blue-600">{a.filnavn}</a></p>
                <p>Utløper: {new Date(a.utløper).toLocaleDateString()}</p>
                <p>Opplastet: {new Date(a.opplastet).toLocaleDateString()}</p>

                <EksporterAttestPDF attest={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dashboard>
  );
}
