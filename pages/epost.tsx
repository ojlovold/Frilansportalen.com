import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import EpostInnboks from "@/components/epost/Innboks";
import NyEpost from "@/components/epost/NyEpost";
import EksporterEpost from "@/components/epost/EksporterEpost";

export default function EpostSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å bruke e-postsystemet.</p>;

  return (
    <Dashboard>
      <Head>
        <title>E-post | Frilansportalen</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-post</h1>
          <EksporterEpost brukerId={user.id} />
        </div>

        <NyEpost fraId={user.id} />
        <EpostInnboks brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
