import Head from "next/head";
import Header from "@/components/Header";

export default function Admin() {
  return (
    <>
      <Head>
        <title>Admin | Frilansportalen</title>
        <meta name="description" content="Adminpanel for Frilansportalen – styring og innsikt" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Adminpanel</h1>
        <p>Her kommer oversikt over forbedringer, lanseringskontroll, prismodul og varslinger.</p>
      </main>
    </>
  );
}
