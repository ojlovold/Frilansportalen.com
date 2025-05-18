// pages/admin/index.tsx
import Head from "next/head";
import Link from "next/link";
import Dashboard from "@/components/Dashboard";

export default function AdminDashboard() {
  return (
    <Dashboard>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>

      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">Adminpanel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          <Link href="/admin/integrasjoner">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Integrasjoner
            </a>
          </Link>

          <Link href="/admin/systemstatus">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Systemstatus
            </a>
          </Link>

          <Link href="/admin/innstillinger">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Fargevalg og logo
            </a>
          </Link>

          <Link href="/admin/brukere">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Brukeroversikt
            </a>
          </Link>

          <Link href="/admin/skjemaer">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Skjemabank
            </a>
          </Link>

          <Link href="/admin/firmadokumenter">
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 text-lg">
              Firmadokumenter
            </a>
          </Link>
        </div>
      </div>
    </Dashboard>
  );
}
