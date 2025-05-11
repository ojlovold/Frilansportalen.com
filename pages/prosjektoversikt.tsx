import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import OpprettProsjekt from "@/components/prosjekt/OpprettProsjekt";
import MineProsjekter from "@/components/prosjekt/MineProsjekter";

export default function ProsjektOversikt() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å se prosjektene dine.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Prosjektoversikt | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <OpprettProsjekt eierId={user.id} />
        <MineProsjekter brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
