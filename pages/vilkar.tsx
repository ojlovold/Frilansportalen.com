import Head from "next/head";
import Layout from "../components/Layout";

export default function Vilkar() {
  return (
    <Layout>
      <Head>
        <title>Vilkår | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Bruksvilkår</h1>

      <div className="text-sm space-y-4 max-w-3xl">
        <p>
          Ved å bruke Frilansportalen godtar du følgende betingelser. Disse vilkårene gjelder for
          alle brukere – frilansere, arbeidsgivere og tjenestetilbydere.
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>Brukeren er selv ansvarlig for informasjonen som legges ut på plattformen.</li>
          <li>
            Det er ikke tillatt å bruke portalen til ulovlige, krenkende eller villedende formål.
          </li>
          <li>
            Brudd på vilkårene kan føre til midlertidig eller permanent utestengelse uten varsel.
          </li>
          <li>
            Frilansportalen lagrer nødvendige data for å kunne levere tjenesten, i tråd med
            personvernerklæringen.
          </li>
          <li>
            Tjenester levert via Frilansportalen skjer på eget ansvar mellom partene.
          </li>
          <li>
            Frilansportalen har rett til å endre vilkårene med rimelig varsel.
          </li>
        </ul>

        <p>
          Ved spørsmål, ta kontakt via{" "}
          <a href="/kontakt" className="underline text-blue-600 hover:text-blue-800">
            kontaktskjemaet
          </a>
          .
        </p>
      </div>
    </Layout>
  );
}
