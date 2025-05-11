import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisGjenbruk from "@/components/gjenbruk/VisGjenbruk";
import LeggTilGjenbruk from "@/components/gjenbruk/LeggTilGjenbruk";

export default function Gjenbruksportalen() {
  return (
    <Dashboard>
      <Head>
        <title>Gjenbruksportalen | Frilansportalen</title>
      </Head>

      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Gjenbruksportalen</h1>
        <p className="text-sm text-gray-700">
          Gies bort, byttes eller repareres. Bidra til mindre avfall og mer deling!
        </p>

        <LeggTilGjenbruk />
        <VisGjenbruk />
      </div>
    </Dashboard>
  );
}
