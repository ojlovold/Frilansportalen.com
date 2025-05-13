// pages/prosjektoversikt.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import OpprettProsjekt from "@/components/prosjekt/OpprettProsjekt";
import MineProsjekter from "@/components/prosjekt/MineProsjekter";
import MineInvitasjoner from "@/components/prosjekt/MineInvitasjoner";

export default function ProsjektOversikt() {
  const rawUser = useUser();
  const user = rawUser && typeof rawUser === "object" && rawUser !== null && "id" in rawUser
    ? (rawUser as User)
    : null;

  if (!user) return <p>Du må være innlogget for å se prosjektene dine.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Prosjektoversikt | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <MineInvitasjoner brukerId={user.id} />
        <OpprettProsjekt eierId={user.id} />
        <MineProsjekter brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
