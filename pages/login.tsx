import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async () => {
    setStatus("Logger inn...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passord,
    });

    if (error) {
      setStatus("Feil: " + error.message);
    } else {
      setStatus("Innlogging vellykket!");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Logg inn | Frilansportalen</title>
      </Head>

      <div className="max-w-md mx-auto bg-gray-200 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Logg inn</h1>

        <label className="block font-semibold mb-1">E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border"
        />

        <label className="block font-semibold mb-1">Passord</label>
        <input
          type="password"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          className="w-full p-2 mb-4 rounded border"
        />

        <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">
          Logg inn
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}

        <Link href="/" className="block text-sm text-blue-600 underline mt-6">
          Tilbake til forsiden
        </Link>
      </div>
    </main>
  );
}
