// pages/stilling/[id]/soknad.tsx
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import supabase from "../../../lib/supabaseClient";
import { hentUtkast, lagreUtkast, slettUtkast } from "../../../lib/utkast";

type Props = {
  stilling: {
    id: string;
    tittel: string;
    sted: string;
    type: string;
    frist: string;
    bransje: string;
  } | null;
};

export default function Soknad({ stilling }: Props) {
  const rawUser = useUser();
  const user = rawUser as unknown as User | null;

  const [tekst, setTekst] = useState("");
  const [sendt, setSendt] = useState(false);
  const mottaker = stilling?.id || "";
  const modul = "soknad";

  useEffect(() => {
    if (!user?.id || !mottaker) return;
    hentUtkast(user.id, mottaker, modul).then((utkast) => {
      setTekst(utkast);
    });
  }, [user, mottaker]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.id && mottaker && tekst) {
        lagreUtkast(user.id, mottaker, modul, tekst);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [tekst, user, mottaker]);

  const sendSoknad = async () => {
    if (!user?.id || !stilling?.id || !tekst) return;

    await supabase.from("epost").insert([
      {
        fra: user.id,
        til: stilling.id,
        innhold: tekst,
        opprettet: new Date().toISOString(),
      },
    ]);

    await slettUtkast(user.id, mottaker, modul);
    setTekst("");
    setSendt(true);
  };

  if (!stilling) {
    return (
      <main className="bg-portalGul min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold">Stilling ikke funnet</h1>
        <p>Stillingen du prøver å søke på er ikke tilgjengelig.</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Søknad – {stilling.tittel}</title>
        <meta name="description" content={`Søk på ${stilling.tittel}`} />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Søk på: {stilling.tittel}</h1>

        <textarea
          className="w-full h-40 p-3 border rounded mb-4"
          placeholder="Skriv søknaden din her..."
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
        />

        <button
          onClick={sendSoknad}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send søknad
        </button>

        {sendt && <p className="text-green-600 mt-3">Søknad sendt!</p>}
      </main>
    </>
  );
}
