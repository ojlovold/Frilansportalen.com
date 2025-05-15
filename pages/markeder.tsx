import Head from "next/head";
import dynamic from "next/dynamic";

const MarkedsListe = dynamic(() => import("@/components/markedsplass/MarkedsListe"), {
  ssr: false,
});

export default function MarkederPage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Markedsplassen | Frilansportalen</title>
      </Head>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Markedsplassen</h1>
        <p className="text-lg mb-6">
          Her finner du produkter og tjenester som tilbys eller etterspørres. Du kan filtrere på kategori, type og søke direkte.
        </p>
        <MarkedsListe />
      </div>
    </main>
  );
}
