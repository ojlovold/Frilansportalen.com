import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";

export default function RegistrerArbeidsgiver() {
  const router = useRouter();
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [orgnr, setOrgnr] = useState("");
  const [status, setStatus] = useState("");

  const handleRegistrering = async () => {
    setStatus("Oppretter bruker...");

    const { data, error } = await supabase.auth.signUp({
      email: epost,
      password: passord
    });

    if (error || !data.user) {
      setStatus("Feil ved registrering: " + (error?.message || "Ukjent feil"));
      return;
    }

    const brukerId = data.user.id;

    setStatus("Kobler firma...");

    const res = await fetch("/api/kobleFirmaTilBruker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgnr, brukerId }),
    });

    if (!res.ok) {
      const err = await res.json();
      setStatus("Firmafeil: " + (err.error || "Ukjent feil"));
      return;
    }

    setStatus("Registrert! Sender deg videre...");
    setTimeout(() => router.push(`/firma/${orgnr}`), 1500);
  };

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Registrer arbeidsgiver | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto bg-gray-200 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Opprett arbeidsgiverkonto</h1>

        <label className="block mb-2 font-semibold">E-post</label>
        <input
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          type="email"
          className="w-full p-2 rounded border mb-4"
          placeholder="din@bedrift.no"
        />

        <label className="block mb-2 font-semibold">Passord</label>
        <input
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          type="password"
          className="w-full p-2 rounded border mb-4"
          placeholder="Minst 6 tegn"
        />

        <label className="block mb-2 font-semibold">Organisasjonsnummer</label>
        <input
          value={orgnr}
          onChange={(e) => setOrgnr(e.target.value)}
          type="text"
          className="w-full p-2 rounded border mb-4"
          placeholder="9 siffer"
        />

        <button
          onClick={handleRegistrering}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Opprett konto
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </main>
  );
}
