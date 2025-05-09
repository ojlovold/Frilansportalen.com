import Head from "next/head";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Frilansportalen</title>
        <meta name="description" content="Frilansportalen – jobb, tjenester, samarbeid" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Velkommen til Frilansportalen</h1>
        <p className="text-lg text-center max-w-xl">
          Plattformen for frilansere, arbeidsgivere og tjenestetilbydere. Alt på ett sted.
        </p>
      </main>
    </>
  );
}
