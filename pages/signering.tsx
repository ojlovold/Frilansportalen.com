// pages/signering.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "@/components/Dashboard";
import DokumentSignering from "@/components/DokumentSignering";

export default function Signering() {
  const user = useUser();

  return (
    <Dashboard>
      <Head>
        <title>Signering | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Dokumentsignering</h1>

      {!user ? (
        <p>Du må være innlogget for å signere dokumenter.</p>
      ) : (
        <div className="space-y-10">
          <DokumentSignering />
        </div>
      )}
    </Dashboard>
  );
}
