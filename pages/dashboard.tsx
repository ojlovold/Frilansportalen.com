import Head from "next/head";
import Dashboard from "@/components/Dashboard";

export default function DashboardSide() {
  return (
    <Dashboard>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <div>
        <h1 className="text-2xl font-bold mb-4">Velkommen til Frilansportalen</h1>
        <p>Dette er ditt personlige dashboard. Bruk menyen til venstre for å navigere.</p>
      </div>
    </Dashboard>
  );
}
