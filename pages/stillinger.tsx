import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import VisStillinger from "@/components/stillinger/VisStillinger";

export default function StillingerSide() {
  return (
    <Dashboard>
      <Head>
        <title>Stillinger | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <VisStillinger />
      </div>
    </Dashboard>
  );
}
