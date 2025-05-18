import Head from "next/head";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import { supabase } from "@/lib/supabaseClient";

export default function ArbeidsgiverStatistikk() {
  const user = useUser() as unknown as User;
  const [stillinger, setStillinger] = useState(0);
  const [søknader, setSøknader] = useState(0);
  const [ansettelser, setAnsettelser] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const hent = async () => {
      const { count: stillingCount } = await supabase
        .from("stillinger")
        .select("*", { count: "exact", head: true })
        .eq("arbeidsgiver_id", user.id);

      const { data: egneStillinger } = await supabase
        .from("stillinger")
        .select("id")
        .eq("arbeidsgiver_id", user.id);

      const stillingIds = egneStillinger?.map((s) => s.id) || [];

      const { count: søknadCount } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .in("stilling_id", stillingIds);

      const { count: ansattCount } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .in("stilling_id", stillingIds)
        .eq("status", "ansatt");

      setStillinger(stillingCount || 0);
      setSøknader(søknadCount || 0);
      setAnsettelser(ansattCount || 0);
    };

    hent();
  }, [user]);

  if (!user) return <p>Du må være innlogget.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Statistikk | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Din statistikk</h1>

        <ul className="space-y-2 text-black">
          <li>Antall stillinger: <strong>{stillinger}</strong></li>
          <li>Mottatte søknader: <strong>{søknader}</strong></li>
          <li>Ansettelser registrert: <strong>{ansettelser}</strong></li>
        </ul>
      </div>
    </Dashboard>
  );
}
