import Head from "next/head";
import Header from "@/components/Header";

interface Fil {
  navn: string;
  type: string;
  dato: string;
}

const filer: Fil[] = [
  { navn: "Kontrakt – Logojobb.pdf", type: "PDF", dato: "2024-04-02" },
  { navn: "Faktura_103.pdf", type: "PDF", dato: "2024-03-28" },
  { navn: "Bilde_arbeid.jpg", type: "JPG", dato: "2024-02-19" },
];

export default function Arkiv() {
  return (
    <>
      <Head>
        <title>Mitt arkiv | Frilansportalen</title>
        <meta name="description" content="Lagre og se dine filer og dokumenter" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mitt arkiv</h1>

        <ul className="space-y-4">
          {filer.map((fil, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{fil.navn}</p>
              <p className="text-sm text-gray-600">{fil.type} – Lagt til: {fil.dato}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
