import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import Varsler from "@/components/Varsler";
import PersonaliaSkjema from "@/components/onboarding/PersonaliaSkjema";

export default function DashboardSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å se dashboardet.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        {/* Onboarding for nye brukere med Premium */}
        <PersonaliaSkjema brukerId={user.id} />

        {/* Varslingskomponent */}
        <Varsler brukerId={user.id} />

        <h1 className="text-2xl font-bold">Velkommen til Frilansportalen</h1>
        <p className="text-black">Dette er ditt personlige dashboard. Bruk menyen til venstre for å navigere.</p>
      </div>
    </Dashboard>
  );
}
