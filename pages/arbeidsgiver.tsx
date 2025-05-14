import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ArbeidsgiverPage() {
  return (
    <>
      <Head>
        <title>Arbeidsgiver | Frilansportalen</title>
        <meta name="description" content="Finn frilansere og arbeidssøkere som passer dine behov" />
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black p-6">
        <section className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Er du arbeidsgiver?</h1>
          <p className="text-lg mb-6">
            Her kan du enkelt finne frilansere, arbeidssøkere og tilby oppdrag innen en rekke fagområder. Stillingskategorier som fast stilling, sommerjobb og småjobb er allerede lagt inn for deg.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Publiser en stilling</h2>
                <p className="mb-4">Bruk vår AI-assistent og legg ut en profesjonell stillingsannonse på under ett minutt.</p>
                <Link href="/stillinger/ny">
                  <Button>Opprett stilling</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Se talentpool</h2>
                <p className="mb-4">Bla gjennom kvalitetssikrede frilansere og arbeidssøkere – filtrert på fag, erfaring og tilgjengelighet.</p>
                <Link href="/talenter">
                  <Button>Utforsk kandidater</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Opprett firma-profil</h2>
                <p className="mb-4">Få tilgang til dashboard, fakturering og organisasjonstjenester ved å registrere ditt firma. Firmainformasjon hentes automatisk fra organisasjonsnummer.</p>
                <Link href="/profil/firma">
                  <Button>Opprett firmaprofil</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Angi plassering</h2>
                <p className="mb-4">Oppgi firmaets geografiske plassering manuelt, via GPS eller postnummer. Brukes til kart og reiseberegning.</p>
                <Link href="/profil/firma#plassering">
                  <Button>Sett plassering</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Personlighetstester</h2>
                <p className="mb-4">Velg mellom innebygde tester (Big Five, DISC), legg inn ekstern testlenke eller aktiver AI-analyse i jobbintervjuet.</p>
                <Link href="/profil/firma#personlighetstester">
                  <Button>Konfigurer tester</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
