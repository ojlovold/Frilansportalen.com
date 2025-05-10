import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");
  const [nyBruker, setNyBruker] = useState(false);
  const [glemt, setGlemt] = useState(false);
  const [melding, setMelding] = useState("");

  const håndterInnlogging = async () => {
    setMelding("");
    const { error } = await supabase.auth.signInWithPassword({
      email: epost,
      password: passord,
    });

    if (error) {
      setMelding("Innlogging feilet: " + error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const håndterRegistrering = async () => {
    setMelding("");
    const { data, error } = await supabase.auth.signUp({
      email: epost,
      password: passord,
    });

    if (error) {
      setMelding("Registrering feilet: " + error.message);
    } else {
      setMelding("Registrert! Bekreft e-posten din før du logger inn.");
    }
  };

  const håndterGlemt = async () => {
    setMelding("");
    const { error } = await supabase.auth.resetPasswordForEmail(epost, {
      redirectTo: "https://frilansportalen.com/tilbakestill",
    });

    if (error) {
      setMelding("Feil: " + error.message);
    } else {
      setMelding("Tilbakestillingslenke sendt til e-post.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>{glemt ? "Glemt passord" : nyBruker ? "Registrering" : "Innlogging"} | Frilansportalen</title>
      </Head>

      <div className="max-w-sm mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {glemt ? "Glemt passord" : nyBruker ? "Opprett ny bruker" : "Logg inn"}
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-post"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {!glemt && (
            <input
              type="password"
              placeholder="Passord"
              value={passord}
              onChange={(e) => setPassord(e.target.value)}
              className="w-full border p-2 rounded"
            />
          )}

          {!glemt && !nyBruker && (
            <button
              onClick={håndterInnlogging}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Logg inn
            </button>
          )}

          {!glemt && nyBruker && (
            <button
              onClick={håndterRegistrering}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Registrer bruker
            </button>
          )}

          {glemt && (
            <button
              onClick={håndterGlemt}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Send tilbakestillingslenke
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-sm space-y-2">
          {!glemt && (
            <p>
              <button onClick={() => setNyBruker(!nyBruker)} className="underline">
                {nyBruker ? "Tilbake til innlogging" : "Opprett ny bruker"}
              </button>
            </p>
          )}
          <p>
            <button onClick={() => setGlemt(!glemt)} className="underline">
              {glemt ? "Tilbake" : "Glemt passord?"}
            </button>
          </p>
        </div>

        {melding && <p className="mt-4 text-sm text-center text-red-600">{melding}</p>}
      </div>
    </Layout>
  );
}
