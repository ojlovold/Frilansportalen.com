import Head from "next/head";
import Layout from "../components/Layout";

export default function Om() {
  return (
    <Layout>
      <Head>
        <title>Om oss | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Om Frilansportalen</h1>

      <div className="text-sm space-y-4 max-w-3xl">
        <p>
          Frilansportalen er utviklet for å gjøre hverdagen enklere for frilansere, jobbsøkere og
          arbeidsgivere. Plattformen samler tjenester, stillinger, regnskap, dokumenter og kommunikasjon på ett sted.
        </p>

        <p>
          Målet er å gjøre det like enkelt å drive som frilanser som det er å være ansatt – men med
          friheten i behold. Portalen er bygget med fokus på tilgjengelighet, brukervennlighet og trygghet.
        </p>

        <p>
          Vi utvikles kontinuerlig og er åpne for forslag, samarbeid og integrasjoner. Plattformen
          driftes med høy grad av datasikkerhet og uten kommersiell mellommann.
        </p>

        <p>
          For henvendelser, bruk vårt{" "}
          <a href="/kontakt" className="underline text-blue-600 hover:text-blue-800">
            kontaktskjema
          </a>
          .
        </p>
      </div>
    </Layout>
  );
}
