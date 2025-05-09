import Head from "next/head";
import Header from "../components/Header";

const skjemaer = [
  {
    navn: "HMS-egenerklæring",
    kategori: "HMS",
    filtype: "PDF",
    url: "#",
  },
  {
    navn: "Helseattest – sjøfolk",
    kategori: "Helse",
    filtype: "PDF",
    url: "#",
  },
  {
    navn: "Arbeidsavtale (standard)",
    kategori: "Kontrakt",
    filtype: "DOCX",
    url: "#",
  },
  {
    navn: "Risikovurdering – verktøybruk",
    kategori: "HMS",
    filtype: "PDF",
    url: "#",
  },
];

export default function Skjemaer() {
  return (
    <>
      <Head>
        <title>Skjemaer | Frilansportalen</title>
        <meta name="description" content="Skjema og maler for HMS, helseattester og kontrakter" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Skjemabank</h1>

        <ul className="space-y-4">
          {skjemaer.map((s, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{s.navn}</p>
              <p className="text-sm text-gray-600">{s.kategori} – {s.filtype}</p>
              <a href={s.url} className="underline text-blue-700">Last ned</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
