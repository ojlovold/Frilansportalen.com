// pages/admin/logginn.tsx
import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Logginn() {
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const login = async () => {
    setFeil("");
    setOk(false);
    const { error } = await supabase.auth.signInWithPassword({
      email: epost,
      password: passord,
    });

    if (error) {
      setFeil("Feil e-post eller passord");
    } else {
      setOk(true);
      setTimeout(() => {
        router.replace("/admin");
      }, 300);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Logg inn | Admin | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Manuell innlogging</h1>

      <div className="max-w-sm space-y-4">
        <input
          placeholder="E-post"
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          className="p-2 border rounded w-full"
          type="email"
        />
        <input
          placeholder="Passord"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          className="p-2 border rounded w-full"
          type="password"
        />
        <button
          onClick={login}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Logg inn
        </button>

        {feil && <p className="text-sm text-red-600">{feil}</p>}
        {ok && <p className="text-sm text-green-600">Innlogging vellykket. Sender deg videre ...</p>}
      </div>
    </Layout>
  );
}
