import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");
  const [huskMeg, setHuskMeg] = useState(false);

  useEffect(() => {
    const lagret = localStorage.getItem("huskMeg");
    if (lagret === "true") setHuskMeg(true);
  }, []);

  const handleLogin = async () => {
    setStatus("Logger inn...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passord,
    });

    if (error) {
      setStatus("❌ " + error.message);
    } else {
      localStorage.setItem("huskMeg", huskMeg.toString());
      setStatus("✅ Innlogging vellykket!");
      setTimeout(() => router.push("/profil"), 1000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head>
        <title>Logg inn | Frilansportalen</title>
      </Head>

      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Logg inn</h1>

        <label className="block font-semibold mb-1">E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold mb-1">Passord</label>
        <input
          type="password"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-2"
        />

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={huskMeg}
              onChange={() => setHuskMeg(!huskMeg)}
              className="accent-black"
            />
            Husk meg
          </label>

          <Link href="/reset-passord" className="text-sm text-blue-600 underline">
            Glemt passord?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Logg inn
        </button>

        {status && <p className="text-center text-sm mt-4">{status}</p>}

        <Link href="/" className="block text-center text-sm text-blue-600 underline mt-6">
          Tilbake til forsiden
        </Link>
      </div>
    </main>
  );
}
