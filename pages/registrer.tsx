// pages/registrer.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Registrer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");

  const handleRegistrering = async () => {
    alert("Vi forsøker å registrere deg...");
    setStatus("Registrerer...");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: passord,
      });

      console.log("Supabase-respons:", data);

      if (error) {
        console.error("Feil ved registrering:", error);
        setStatus("❌ Feil: " + error.message);
      } else if (data?.user) {
        console.log("Bruker opprettet:", data.user);
        setStatus("✅ Registrert! Sjekk e-posten din for bekreftelse.");
      } else {
        console.warn("Ukjent respons fra Supabase:", data);
        setStatus("⚠️ Ukjent respons. Sjekk e-posten din.");
      }
    } catch (err) {
      console.error("Uventet feil:", err);
      setStatus("❌ Uventet feil. Se konsoll for detaljer.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head>
        <title>Registrer deg | Frilansportalen</title>
      </Head>
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Opprett konto</h1>

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
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <button
          onClick={handleRegistrering}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Registrer deg
        </button>

        {status && <p className="text-center text-sm mt-4">{status}</p>}

        <Link href="/login" className="block text-center text-sm text-blue-600 underline mt-6">
          Allerede medlem? Logg inn
        </Link>
      </div>
    </main>
  );
}
