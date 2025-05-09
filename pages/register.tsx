import Head from "next/head";
import Header from "@/components/Header";
import { useState } from "react";

export default function Register() {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Koble til backend for ekte registrering
    console.log("Ny bruker registrert:", { navn, epost });
    setStatus("Bruker registrert! Du kan nå logge inn.");
    setNavn("");
    setEpost("");
    setPassord("");
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
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Opprett konto
          </button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </main>
    </>
  );
}
