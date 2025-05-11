import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisDugnader from "@/components/dugnad/VisDugnader";
import LeggTilDugnad from "@/components/dugnad/LeggTilDugnad";

export default function Dugnadsportalen() {
  return (
    <Dashboard>
      <Head>
        <title>Dugnadsportalen | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dugnadsportalen</h1>
        <p className="text-sm text-gray-700">
          Her kan du legge ut frivillige oppdrag, be om hjelp eller tilby innsats. Tjenesten er åpen, gratis og bygget på tillit og fellesskap.
        </p>

        <LeggTilDugnad />
        <VisDugnader />
      </div>
    </Dashboard>
  );
}
