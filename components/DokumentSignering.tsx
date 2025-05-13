import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import Layout from "../components/Layout";
import DokumentSignering from "../components/DokumentSignering";

export default function Signering() {
  const rawUser = useUser();
  const user = rawUser && typeof rawUser === "object" && rawUser !== null && "id" in rawUser ? rawUser as any : null;

  return (
    <Layout>
      <Head>
        <title>Signering | Frilansportalen</title>
      </Head>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dokumentsignering</h1>

        {!user?.id ? (
          <p>Du må være innlogget for å signere dokumenter.</p>
        ) : (
          <div className="space-y-10">
            <DokumentSignering brukerId={user.id} />
          </div>
        )}
      </div>
    </Layout>
  );
}
