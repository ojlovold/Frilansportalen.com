import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisDugnader from "@/components/dugnad/VisDugnader";

export default function SommerjobbSide() {
  return (
    <Dashboard>
      <Head>
        <title>Sommerjobber | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Sommerjobber</h1>
        <VisDugnader filterType="sommerjobb" />
      </div>
    </Dashboard>
  );
}
