import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const MarkedsListe = dynamic(() => import("@/components/markedsplass/MarkedsListe"), {
  ssr: false,
});

export default function SjappaPage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Sjappa | Frilansportalen</title>
      </Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/markeder" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-black hover:underline">
              <ArrowLeft size={20} /> Tilbake til markedsvalg
            </a>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Sjappa</h1>
        <p className="text-lg mb-8">
          Utforsk annonser for kjøp og salg av produkter og tjenester i ditt område. Filtrer og finn det du trenger.
        </p>

        <div className="bg-gray-200 p-4 rounded-2xl shadow-lg">
          <MarkedsListe />
        </div>
      </div>
    </main>
  );
}
