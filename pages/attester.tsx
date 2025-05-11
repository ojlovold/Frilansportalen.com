import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import LastOppAttest from "@/components/dokumenter/LastOppAttest";
import MineAttester from "@/components/dokumenter/MineAttester";

export default function AttesterSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å se attester.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Attester og dokumenter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <LastOppAttest brukerId={user.id} />
        <MineAttester brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
