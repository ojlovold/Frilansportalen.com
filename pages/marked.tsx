import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Marked() {
  return (
    <Layout>
      <Head>
        <title>Marked | Frilansportalen</title>
        <meta name="description" content="Kjøp og salg av utstyr, tjenester og ressurser i Frilansportalen" />
      </Head>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Marked</h1>
        <p className="mb-6 text-gray-700">
          Velkommen til markedsplassen! Her kan du kjøpe, selge eller gi bort utstyr, tjenester og ressurser
          knyttet til frilansarbeid og oppdrag.
        </p>

        <div className="space-y-4">
          <div className="bg-white border rounded p-4 shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-lg">Gis bort: Stativ til lysrigg</h2>
            <p className="text-sm text-gray-600 mb-2">Oslo | 2 dager siden</p>
            <p className="text-sm">Har to stativer til overs etter produksjon. Hentes i Oslo sentrum.</p>
          </div>

          <div className="bg-white border rounded p-4 shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-lg">Til salgs: Zoom H6 lydopptaker</h2>
            <p className="text-sm text-gray-600 mb-2">Bergen | 4 dager siden</p>
            <p className="text-sm">Lite brukt lydopptaker selges grunnet oppgradering. 1 200 kr.</p>
          </div>

          <div className="bg-white border rounded p-4 shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-lg">Tjeneste: Redigeringshjelp</h2>
            <p className="text-sm text-gray-600 mb-2">Digitalt | 1 uke siden</p>
            <p className="text-sm">Tilbyr hjelp med klipping av video, lyddesign og eksport.</p>
          </div>
        </div>

        <div className="mt-8 text-sm text-center text-gray-500">
          <Link href="/dashboard" className="text-black hover:underline">
            Tilbake til dashboard
          </Link>
        </div>
      </main>
    </Layout>
  );
}
