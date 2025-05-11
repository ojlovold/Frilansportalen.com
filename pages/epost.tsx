import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import EpostInnboks from "@/components/epost/Innboks";

export default function EpostSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å se e-postene dine.</p>;

  return (
    <Dashboard>
      <Head>
        <title>E-post | Frilansportalen</title>
      </Head>
      <div className="space-y-6">
        <EpostInnboks brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
