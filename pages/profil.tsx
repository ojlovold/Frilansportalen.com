import { useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CVUpload from "@/components/profil/CVUpload";
import Søknader from "@/components/profil/Søknader";
import Profilkort from "@/components/profil/Profilkort";

export default function Profilside() {
  const user = useUser();

  if (!user) return <p>Du må være innlogget for å se denne siden.</p>;

  return (
    <DashboardLayout>
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>
      <div className="p-4 space-y-6">
        <Profilkort userId={user.id} />
        <CVUpload userId={user.id} />
        <Søknader userId={user.id} />
      </div>
    </DashboardLayout>
  );
}
