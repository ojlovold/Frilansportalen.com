import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Chat() {
  const samtaler = [
    { navn: "MediaHuset", sist: "Hei, vi er interessert!" },
    { navn: "Kari AS", sist: "Kan du sende kontrakt?" },
  ];

  return (
    <Layout>
      <Head>
        <title>Chat | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Meldinger og samtaler</h1>

      <div className="grid gap-4">
        {samtaler.map(({ navn, sist }, i) => (
          <Link
            key={i}
            href="#"
            className="block border border-black bg-white rounded-lg p-4 hover:bg-gray-50"
          >
            <h2 className="font-semibold">{navn}</h2>
            <p className="text-sm text-gray-600 mt-1">{sist}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/meldinger" className="text-sm underline hover:text-black">
          Start ny melding
        </Link>
      </div>
    </Layout>
  );
}
