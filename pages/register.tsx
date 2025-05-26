import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Register() {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");
  const [feil, setFeil] = useState("");
  const supabase = useSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setFeil("");

    const { error } = await supabase.auth.signUp({
      email: epost,
      password: passord,
      options: {
        data: { navn },
      },
    });

    if (error) {
      setFeil("Noe gikk galt: " + error.message);
    } else {
      setStatus("Bruker registrert! Sjekk e-posten din for å bekrefte kontoen.");
      setNavn("");
      setEpost("");
      setPassord("");
    }
  };

  return (
    <>
      <Head>
        <title>Registrer deg | Frilansportalen</title>
        <meta name="description" content="Opprett en konto i Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Registrer deg</h1>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          <div>
            <label className="block font-semibold">Navn</label>
            <input
              type="text"
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">E-post</label>
            <input
              type="email"
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Passord</label>
            <input
              type="password"
              value={passord}
              onChange={(e) => setPassord(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-sm">
            <strong>Viktig:</strong> Etter at du har opprettet konto, må du bekrefte e-posten din via lenken du får.
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full">
            Opprett konto
          </button>
        </form>

        {status && <p className="mt-4 text-green-700 text-sm">{status}</p>}
        {feil && <p className="mt-4 text-red-700 text-sm">{feil}</p>}
      </main>
    </>
  );
}
