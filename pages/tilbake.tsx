import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Tilbake() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Sender deg tilbake | Frilansportalen</title>
      </Head>

      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Alt klart!</h1>
        <p className="text-sm text-gray-600 mb-6">Du blir straks sendt tilbake der du kom fra.</p>
        <button
          onClick={() => router.back()}
          className="text-sm underline text-blue-600 hover:text-blue-800"
        >
          Gå tilbake nå
        </button>
      </div>
    </Layout>
  );
}
