import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import Fagbibliotek from "@/components/fag/Fagbibliotek";

export default function FagbibliotekSide() {
  return (
    <Dashboard>
      <Head>
        <title>Fagbibliotek | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <Fagbibliotek />
      </div>
    </Dashboard>
  );
}
