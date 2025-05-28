// pages/admin/signup.tsx
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "../../components/Layout";

export default function AdminSignup() {
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const signup = async () => {
    setFeil("");
    setOk(false);

    const { data, error } = await supabase.auth.signUp({
      email: "ole@frilansportalen.com",
      password: passord,
    });

    if (error) {
      setFeil(error.message);
    } else {
      setOk(true);
      setTimeout(() => {
        router.replace("/admin/logginn");
      }, 1000);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Registrer admin | Frilansportalen</title>
      </Head>
      <div className="min-h-screen bg-portalGul flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-bold">Registrer Admin</h1>

          <input
            type="text"
            value="ole@frilansportalen.com"
            disabled
            className="p-2 border rounded w-full bg-gray-100"
          />
          <input
            placeholder="Velg passord"
            type="password"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={signup}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full text-sm"
          >
            Registrer bruker
          </button>

          {feil && <p className="text-red-600 text-sm">{feil}</p>}
          {ok && <p className="text-green-600 text-sm">Bruker registrert! Går videre til innlogging ...</p>}
        </div>
      </div>
    </Layout>
  );
}
