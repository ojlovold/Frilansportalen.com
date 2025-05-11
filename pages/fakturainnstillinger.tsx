import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import Fakturainnstillinger from "@/components/profil/Fakturainnstillinger";

export default function FakturainnstillingerSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å endre fakturainnstillinger.</p>;

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
