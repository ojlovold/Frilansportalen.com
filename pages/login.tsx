import Head from "next/head";
import Header from "@/components/Header";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Koble til backend for ekte innlogging
    if (email === "demo@frilansportalen.com" && passord === "1234") {
      setStatus("Innlogging vellykket!");
    } else {
      setStatus("Feil e-post eller passord.");
    }
  };

  return (
    <>
      <Head>
        <title>Logg inn | Frilansportalen</title>
        <meta name="description" content="Logg inn på din konto i Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Logg inn</h1>

        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
          <div>
            <label className="block font-semibold">E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Logg inn
          </button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </main>
    </>
  );
}
