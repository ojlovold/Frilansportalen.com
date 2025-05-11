import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import LastOppKontrakt from "@/components/kontrakt/LastOppKontrakt";
import MineKontrakter from "@/components/kontrakt/MineKontrakter";

export default function KontrakterSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å bruke kontraktssystemet.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Kontrakter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <LastOppKontrakt oppretterId={user.id} />
        <MineKontrakter brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
