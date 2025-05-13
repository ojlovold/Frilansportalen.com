// pages/prosjektoversikt.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import MineInvitasjoner from "@/components/prosjekt/MineInvitasjoner";
import OpprettProsjekt from "@/components/prosjekt/OpprettProsjekt";
import MineProsjekter from "@/components/prosjekt/MineProsjekter";

export default function ProsjektOversikt() {
  const user = useUser();

  if (!user || typeof user !== "object" || !("id" in user)) {
    return (
      <Dashboard>
        <p>Du må være innlogget for å se prosjektene dine.</p>
      </Dashboard>
    );
  }

  const brukerId = user.id as string;

  return (
    <Dashboard>
      <Head>
        <title>Prosjektoversikt | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <MineInvitasjoner brukerId={brukerId} />
        <OpprettProsjekt eierId={brukerId} />
        <MineProsjekter brukerId={brukerId} />
      </div>
    </Dashboard>
  );
}
