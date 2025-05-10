import Head from "next/head";
import Layout from "../components/Layout";

export default function Personvern() {
  return (
    <Layout>
      <Head>
        <title>Personvern | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Personvernerklæring</h1>

      <div className="text-sm space-y-4 max-w-3xl">
        <p>
          Frilansportalen samler inn og lagrer kun nødvendig informasjon for å levere tjenesten.
          Dine data behandles konfidensielt og deles ikke med tredjepart uten samtykke.
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            Vi lagrer navn, e-post, profilopplysninger og eventuelle dokumenter du selv laster opp.
          </li>
          <li>
            Du kan når som helst be om innsyn, endring eller sletting av dine data ved å kontakte
            oss.
          </li>
          <li>
            Supabase brukes som underleverandør for database, lagring og autentisering.
          </li>
          <li>
            Vi benytter informasjonskapsler (cookies) for innlogging og brukeropplevelse.
          </li>
          <li>
            Alle opplastede dokumenter er kun tilgjengelig for deg og eventuelt mottaker du har
            samtykket til.
          </li>
          <li>
            Vi bruker SSL-kryptering og sikkerhetspraksis som beskytter data mot uautorisert
            tilgang.
          </li>
        </ul>

        <p>
          For spørsmål om personvern, kontakt oss via{" "}
          <a href="/kontakt" className="underline text-blue-600 hover:text-blue-800">
            kontaktskjemaet
          </a>
          .
        </p>
      </div>
    </Layout>
  );
}
