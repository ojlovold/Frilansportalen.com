import Head from "next/head";
import Layout from "../components/Layout";

export default function Roller() {
  const brukere = [
    { navn: "Ole Gründer", rolle: "Admin" },
    { navn: "Anna Fjell", rolle: "Tjenestetilbyder" },
    { navn: "Kari AS", rolle: "Arbeidsgiver" },
    { navn: "Jonas B", rolle: "Frilanser" },
  ];

  return (
    <Layout>
      <Head>
        <title>Roller | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Brukerroller</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Navn</th>
            <th className="p-2">Rolle</th>
          </tr>
        </thead>
        <tbody>
          {brukere.map(({ navn, rolle }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{navn}</td>
              <td className="p-2">{rolle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
