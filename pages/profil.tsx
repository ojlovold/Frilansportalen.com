import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import Profilkort from "@/components/profil/Profilkort";
import CVUpload from "@/components/profil/CVUpload";
import Søknader from "@/components/profil/Søknader";
import EksporterAltSomPDF from "@/components/profil/EksporterAltSomPDF";
import EksporterGDPR from "@/components/profil/EksporterGDPR";

export default function ProfilSide() {
  const user = useUser();
  if (!user) return <p>Du må være innlogget for å se denne siden.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <Profilkort userId={user.id} />
        <CVUpload userId={user.id} />
        <Søknader userId={user.id} />
        <EksporterAltSomPDF brukerId={user.id} />
        <EksporterGDPR brukerId={user.id} />
      </div>
    </Dashboard>
  );
}
