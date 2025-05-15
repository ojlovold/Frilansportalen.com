import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

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
        <div className="mb-4 flex items-center justify-between">
          <Link href="/markeder" legacyBehavior>
            <a className="inline-flex items-center gap-2 text-black hover:underline">
              <ArrowLeft size={20} /> Tilbake til markedsvalg
            </a>
          </Link>
          <Link href="/markeder/ny" legacyBehavior>
            <a className="bg-gray-200 rounded-xl shadow-md px-4 py-2 inline-flex items-center gap-2 hover:bg-gray-300">
              <Plus size={18} /> Legg ut ny annonse
            </a>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Sjappa</h1>
        <p className="text-lg mb-6">
          Utforsk produkter og tjenester til salgs. Filtrer og finn det du trenger i ditt nærområde.
        </p>

        <div className="bg-gray-200 rounded-2xl p-6 shadow-2xl">
          <MarkedsListe />
        </div>
      </div>
    </main>
  );
}
