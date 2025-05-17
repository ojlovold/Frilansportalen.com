import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import Fakturainnstillinger from "@/components/profil/Fakturainnstillinger";

export default function FakturainnstillingerSide() {
  const user = useUser() as unknown as User;

  if (!user?.id) {
    return <p>Du må være innlogget for å endre fakturainnstillinger.</p>;
  }

  return (
    <Dashboard>
      <Head>
        <title>Fakturainnstillinger | Frilansportalen</title>
      </Head>
      <div className="space-y-6">
        <Fakturainnstillinger brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
