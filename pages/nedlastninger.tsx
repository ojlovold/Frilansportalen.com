import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Nedlastninger() {
  const eksport = [
    { navn: "Kjørebok", lenke: "/kjorebok" },
    { navn: "Årsoppgjør", lenke: "/arsoppgjor" },
    { navn: "MVA-oppgjør", lenke: "/mva" },
    { navn: "Fakturaoversikt", lenke: "/faktura" },
    { navn: "Altinn-eksport (JSON)", lenke: "/altinn-eksport" },
  ];

  return (
    <Layout>
      <Head>
        <title>Nedlastninger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Nedlastninger</h1>

      <ul className="space-y-4 text-sm bg-white border border-black rounded p-6 max-w-xl">
        {eksport.map((e, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>{e.navn}</span>
            <Link
              href={e.lenke}
              className="underline text-blue-600 hover:text-blue-800"
            >
              Gå til PDF
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
