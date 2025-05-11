import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisAnnonser from "@/components/marked/VisAnnonser";
import LeggUtAnnonse from "@/components/marked/LeggUtAnnonse";

export default function Markedsplass() {
  return (
    <Dashboard>
      <Head>
        <title>Markedsplass | Frilansportalen</title>
      </Head>

      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Markedsplassen</h1>
        <p className="text-sm text-gray-700">
          Selg, gi bort eller etterlys utstyr og tjenester. Privatpersoner annonserer gratis.
          Firma må betale for publisering.
        </p>

        <LeggUtAnnonse />
        <VisAnnonser />
      </div>
    </Dashboard>
  );
}
