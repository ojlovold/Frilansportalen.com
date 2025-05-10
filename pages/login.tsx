import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [feil, setFeil] = useState("");
  const router = useRouter();

  const loggInn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeil("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passord,
    });

    if (error) {
      setFeil("Feil e-post eller passord.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Logg inn | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Logg inn</h1>

      <form onSubmit={loggInn} className="grid gap-4 max-w-sm">
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Passord"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Logg inn
        </button>
        {feil && <p className="text-red-600 text-sm">{feil}</p>}
      </form>
    </Layout>
  );
}
