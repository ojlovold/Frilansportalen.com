import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Onboarding() {
  const [klar, setKlar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const oppdaterStatus = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      await supabase
        .from("profiler")
        .upsert({ id, onboarding_fullført: true });

      setKlar(true);
    };

    oppdaterStatus();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Velkommen | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Velkommen til Frilansportalen</h1>

      <p className="text-sm text-gray-700 mb-8 max-w-xl">
        Dette er plattformen der du kan fakturere, tilby tjenester, finne arbeid, lagre dokumenter
        og bruke kunstig intelligens – alt på ett sted. Her er hvordan du kommer i gang:
      </p>

      <ul className="grid gap-4 max-w-lg text-sm list-disc list-inside">
        <li>
          <Link href="/profil/oppdater" className="underline text-blue-700 hover:text-blue-900">
            Oppdater profilen din
          </Link>{" "}
          med navn, bilde og e-post
        </li>
        <li>
          <Link href="/tjenester/ny" className="underline text-blue-700 hover:text-blue-900">
            Opprett en tjeneste
          </Link>{" "}
          og bli synlig for arbeidsgivere
        </li>
        <li>
          <Link href="/faktura/ny-faktura" className="underline text-blue-700 hover:text-blue-900">
            Send din første faktura
          </Link>{" "}
          med eller uten vedlegg
        </li>
        <li>
          <Link href="/ai" className="underline text-blue-700 hover:text-blue-900">
            Prøv AI-assistenten
          </Link>{" "}
          til å skrive søknad, melding eller anbud
        </li>
        <li>
          <Link href="/dashboard" className="underline text-blue-700 hover:text-blue-900">
            Gå til dashboardet ditt
          </Link>{" "}
          for full oversikt over dine data
        </li>
      </ul>

      {klar && (
        <p className="mt-8 text-sm text-green-600">
          Onboarding registrert som fullført. Du kan bruke portalen fritt.
        </p>
      )}
    </Layout>
  );
}
