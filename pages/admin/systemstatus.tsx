import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function SystemstatusSide() {
  const [faglenker, setFaglenker] = useState(0);
  const [attesterSomUtgår, setAttesterSomUtgår] = useState(0);
  const [ulesteVarsler, setUlesteVarsler] = useState(0);

  useEffect(() => {
    const hentStatus = async () => {
      const iDag = new Date();
      const om30 = new Date();
      om30.setDate(iDag.getDate() + 30);

      const { count: fag } = await supabase
        .from("fagbibliotek")
        .select("*", { count: "exact", head: true });

      const { count: utlop } = await supabase
        .from("attester")
        .select("*", { count: "exact", head: true })
        .lt("utløper", om30.toISOString());

      const { count: varsler } = await supabase
        .from("varsler")
        .select("*", { count: "exact", head: true })
        .eq("lest", false);

      setFaglenker(fag || 0);
      setAttesterSomUtgår(utlop || 0);
      setUlesteVarsler(varsler || 0);
    };

    hentStatus();
  }, []);

  return (
    <Dashboard>
      <Head>
        <title>Systemstatus | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Systemstatus</h1>

        <ul className="space-y-2 text-black">
          <li>Lenker i fagbiblioteket: <strong>{faglenker}</strong></li>
          <li>Attester med utløp innen 30 dager: <strong>{attesterSomUtgår}</strong></li>
          <li>Uleste varsler i systemet: <strong>{ulesteVarsler}</strong></li>
        </ul>
      </div>
    </Dashboard>
  );
}
