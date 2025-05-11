import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import EpostInnboks from "@/components/epost/Innboks";
import NyEpost from "@/components/epost/NyEpost";

export default function EpostSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å bruke e-postsystemet.</p>;

  return (
    <Dashboard>
      <Head>
        <title>E-post | Frilansportalen</title>
      </Head>

      <div className="space-y-8">
        <NyEpost fraId={user.id} />
        <EpostInnboks brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
