import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function Signup() {
  const [status, setStatus] = useState("");
  const supabase = useSupabaseClient();
  const router = useRouter();

  const opprett = async () => {
    setStatus("Prøver å registrere...");

    const { data, error } = await supabase.auth.signUp({
      email: "ole@frilansportalen.com",
      password: "@Bente01",
    });

    if (error) {
      console.error("❌ Feil:", error.message);
      setStatus("❌ Feil: " + error.message);
    } else {
      setStatus("✅ Bruker opprettet! Gå til innlogging...");
      setTimeout(() => router.push("/admin/logginn"), 1500);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-portalGul flex items-center justify-center px-4 text-center">
        <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
          <h1 className="text-xl font-bold">Registrer admin</h1>
          <p>Registrerer <strong>ole@frilansportalen.com</strong> med passord <strong>@Bente01</strong></p>
          <button
            onClick={opprett}
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Opprett bruker
          </button>
          <p className="text-sm mt-2">{status}</p>
        </div>
      </div>
    </Layout>
  );
}
