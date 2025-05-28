// pages/admin/logginn.tsx
import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";

export default function LoggInn() {
  const [epost, setEpost] = useState("ole@frilansportalen.com");
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");
  const [ok, setOk] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  const login = async () => {
    setFeil("");
    setOk(false);

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email: epost,
      password: passord,
    });

    if (error || !loginData.session) {
      setFeil("Feil e-post eller passord");
      return;
    }

    setOk(true);

    // Koble inn i `brukere` med rolle: admin
    const brukerId = loginData.user?.id;
    if (brukerId) {
      await supabase.from("brukere").upsert({
        id: brukerId,
        epost,
        rolle: "admin",
      });
    }

    setTimeout(() => {
      router.replace("/admin");
    }, 300);
  };

  return (
    <Layout>
      <Head>
        <title>Admin | Frilansportalen</title>
      </Head>

      <div className="min-h-screen bg-portalGul flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Image
            src="/logo.jpeg"
            alt="Frilansportalen logo"
            width={160}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold">Admin</h1>

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
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm w-full"
          >
            Logg inn
          </button>

          {feil && <p className="text-sm text-red-600">{feil}</p>}
          {ok && <p className="text-sm text-green-600">Innlogging vellykket. Sender deg videre ...</p>}
        </div>
      </div>
    </Layout>
  );
}
