// pages/smajobb.tsx
import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisDugnader from "@/components/dugnad/VisDugnader";

export default function SmajobbSide() {
  return (
    <Dashboard>
      <Head>
        <title>Småjobber | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Småjobber</h1>
        <VisDugnader />
      </div>
    </Dashboard>
  );
}
