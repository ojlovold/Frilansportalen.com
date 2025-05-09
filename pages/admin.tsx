import Head from "next/head";
import Header from "../components/Header";
import { isAdmin } from "../lib/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginHelper from "../components/LoginHelper";

export default function Admin() {
  const router = useRouter();
  const [godkjent, setGodkjent] = useState(false);
  const [sjekket, setSjekket] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      setSjekket(true);
    } else {
      setGodkjent(true);
    }
  }, []);

  if (!godkjent && !sjekket) return null;

  return (
    <>
      <Head>
        <title>Admin | Frilansportalen</title>
        <meta name="description" content="Adminpanel for Frilansportalen – kun for administrator" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        {!godkjent && sjekket ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Adgang nødvendig</h1>
            <p className="mb-4">Trykk på knappen under for å logge inn som admin på denne enheten:</p>
            <LoginHelper />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Adminpanel</h1>
            <p>Du er nå logget inn som administrator.</p>
          </>
        )}
      </main>
    </>
  );
}
