import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import DokumentArkiv from "@/components/profil/DokumentArkiv";
import LastOppDokument from "@/components/profil/LastOppDokument";

export default function Dokumenter() {
  const user = useUser() as unknown as User;

  if (!user?.id) return <p>Du må være innlogget for å se dokumentene dine.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Mine dokumenter | Frilansportalen</title>
      </Head>
      <div className="p-6 space-y-6">
        <LastOppDokument userId={user.id} />
        <DokumentArkiv userId={user.id} />
      </div>
    </Dashboard>
  );
}
