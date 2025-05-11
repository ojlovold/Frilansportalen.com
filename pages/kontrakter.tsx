import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import LastOppKontrakt from "@/components/kontrakt/LastOppKontrakt";
import EksporterKontraktPDF from "@/components/kontrakt/EksporterKontraktPDF";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function KontrakterSide() {
  const user = useUser();
  const [kontrakter, setKontrakter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("kontrakter")
        .select("*")
        .or(`oppretter.eq.${user.id},mottaker.eq.${user.id}`)
        .not("slettet", "is", true)
        .order("opprettet", { ascending: false });

      setKontrakter(data || []);
    };

    hent();
  }, [user]);

  if (!user) return <p>Du må være innlogget for å se kontrakter.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Kontrakter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <LastOppKontrakt oppretterId={user.id} />

        <h2 className="text-xl font-bold">Mine kontrakter</h2>

        {kontrakter.length === 0 ? (
          <p>Ingen kontrakter funnet.</p>
        ) : (
          <ul className="space-y-4">
            {kontrakter.map((k) => (
              <li key={k.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
                <p><strong>Fil:</strong> <a href={k.url} target="_blank" className="underline text-blue-600">{k.filnavn}</a></p>
                <p>Status: {k.status}</p>
                <p>Signert oppretter: {k.signert_oppretter ? "Ja" : "Nei"}</p>
                <p>Signert mottaker: {k.signert_mottaker ? "Ja" : "Nei"}</p>
                <p>Dato: {new Date(k.opprettet).toLocaleDateString()}</p>

                <EksporterKontraktPDF kontrakt={k} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dashboard>
  );
}
