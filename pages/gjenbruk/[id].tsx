import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseClient";
import { loggVisning } from "../../lib/visningslogg";

type Props = {
  oppforing: {
    id: string;
    tittel: string;
    sted: string;
    kategori: string;
    beskrivelse: string;
    pris: number;
  } | null;
};

export default function GjenbrukVisning({ oppforing }: Props) {
  const user = useUser() as unknown as User;

  useEffect(() => {
    if (user?.id && oppforing?.id) {
      loggVisning(user.id, "gjenbruk", oppforing.id);
    }
  }, [user, oppforing]);

  if (!oppforing) {
    return (
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <h1 className="text-3xl font-bold">Oppføring ikke funnet</h1>
        <p>Denne gjenbruksoppføringen finnes ikke eller er fjernet.</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{oppforing.tittel} | Frilansportalen</title>
        <meta name="description" content={`Gratis oppføring: ${oppforing.tittel}`} />
      </Head>
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{oppforing.tittel}</h1>
          <p className="text-sm text-gray-600 mb-4">
            {oppforing.kategori} | {oppforing.sted} |{" "}
            {oppforing.pris === 0 ? "Gratis" : `${oppforing.pris} kr`}
          </p>
          <p>{oppforing.beskrivelse}</p>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id;

  const { data, error } = await supabase
    .from("gjenbruk")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      oppforing: error ? null : data,
    },
  };
};
