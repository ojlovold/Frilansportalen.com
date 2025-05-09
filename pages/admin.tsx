import Head from "next/head";
import Header from "@/components/Header";
import { isAdmin } from "@/lib/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Admin() {
  const router = useRouter();
  const [godkjent, setGodkjent] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/login");
    } else {
      setGodkjent(true);
    }
  }, []);

  if (!godkjent) {
    return null; // viser ingenting mens det sjekkes
  }

  return (
    <>
      <Head>
        <title>Admin | Frilansportalen</title>
        <meta name="description" content="Adminpanel for Frilansportalen – styring og innsikt" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Adminpanel</h1>
        <p>Du er nå logget inn som administrator.</p>
      </main>
    </>
  );
}
