import Head from "next/head";
import Link from "next/link";
import { Settings, FileText, Paintbrush, Users, ShieldCheck, ServerCog } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-8">
      <Head>
        <title>Admin | Frilansportalen</title>
      </Head>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Adminpanel</h1>
        <span className="text-sm text-gray-700">Full tilgang – superbruker</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/integrasjoner" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <Settings className="text-2xl" /> Administrer integrasjoner
        </Link>
        <Link href="/admin/utseende" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <Paintbrush className="text-2xl" /> Farger og logo
        </Link>
        <Link href="/admin/brukere" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <Users className="text-2xl" /> Brukeroversikt
        </Link>
        <Link href="/admin/systemstatus" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <ShieldCheck className="text-2xl" /> Systemstatus
        </Link>
        <Link href="/admin/faktura" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FileText className="text-2xl" /> Fakturainnstillinger
        </Link>
        <Link href="/admin/moduler" className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <ServerCog className="text-2xl" /> Modultilgang
        </Link>
      </div>
    </main>
  );
}
