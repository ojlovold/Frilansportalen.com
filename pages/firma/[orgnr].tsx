import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function FirmaProfil({ firma }: { firma: any }) {
  const [eier, setEier] = useState(false);

  useEffect(() => {
    const sjekkEierskap = async () => {
      const { data: session } = await supabase.auth.getUser();
      const brukerId = session?.user?.id;
      if (!brukerId || !firma?.id) return;

      const { data } = await supabase
        .from("brukere")
        .select("firma_id")
        .eq("id", brukerId)
        .single();

      if (data?.firma_id === firma.id) {
        setEier(true);
      }
    };

    sjekkEierskap();
  }, [firma?.id]);

  if (!firma) {
    return (
      <main className="min-h-screen bg-yellow-300 text-black p-8">
        <h1 className="text-2xl font-bold mb-4">Firma ikke funnet</h1>
        <p>Denne bedriften er ikke registrert i Frilansportalen enda.</p>
        <Link href="/" className="text-blue-600 underline mt-4 block">Tilbake til forsiden</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-8">
      <Head>
        <title>{firma.navn} | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">{firma.navn}</h1>

      <p><strong>Organisasjonsnummer:</strong> {firma.organisasjonsnummer}</p>
      {firma.adresse && <p><strong>Adresse:</strong> {firma.adresse}</p>}
      {firma.postnummer && firma.poststed && (
        <p><strong>Poststed:</strong> {firma.postnummer} {firma.poststed}</p>
      )}
      {firma.kommune && <p><strong>Kommune:</strong> {firma.kommune}</p>}
      {firma.fylke && <p><strong>Fylke:</strong> {firma.fylke}</p>}
      {firma.bransje && <p><strong>Bransje:</strong> {firma.bransje}</p>}
      {firma.nettside && (
        <p>
          <strong>Nettside:</strong>{" "}
          <a href={firma.nettside} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {firma.nettside}
          </a>
        </p>
      )}

      <Link href="/" className="text-blue-600 underline mt-6 block">Tilbake til forsiden</Link>

      {eier && (
        <div className="mt-10 p-6 bg-gray-200 rounded-2xl shadow max-w-xl">
          <h2 className="text-xl font-bold mb-4">Firmadashboard</h2>
          <ul className="space-y-2">
            <li><Link href="/firma/rediger" className="text-blue-600 underline">Rediger firmaprofil</Link></li>
            <li><Link href="/stillinger/ny" className="text-blue-600 underline">Legg ut stillingsannonse</Link></li>
            <li><Link href="/firma/stillinger" className="text-blue-600 underline">Se aktive stillinger</Link></li>
            <li><Link href="/firma/soknader" className="text-blue-600 underline">Se innsendte søknader</Link></li>
          </ul>
        </div>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const orgnr = context.params?.orgnr;

  if (!orgnr || typeof orgnr !== "string") {
    return { props: { firma: null } };
  }

  const { data } = await supabase
    .from("firmaer")
    .select("*")
    .eq("organisasjonsnummer", orgnr)
    .single();

  return {
    props: {
      firma: data || null,
    },
  };
};
