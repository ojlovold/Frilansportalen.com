// pages/admin/index.tsx
import Head from "next/head";
import Link from "next/link";
import {
  Settings,
  Users,
  ShieldCheck,
  Palette,
  Database,
} from "lucide-react";

export default function AdminPanel() {
  return (
    <>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-yellow-300 text-black p-8">
        <h1 className="text-3xl font-bold mb-8">Adminpanel</h1>

        $1
          <Link href="/admin/arv" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <ShieldCheck /> Arverett og eierskap
            </a>
          </Link>
          <Link href="/admin/brukere" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <Users /> Brukere og profiler
            </a>
          </Link>
          <Link href="/admin/integrasjoner" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <Settings /> Vipps og Altinn
            </a>
          </Link>
          <Link href="/admin/systemstatus" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <ShieldCheck /> Systemstatus
            </a>
          </Link>
          <Link href="/admin/design" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <Palette /> Farger og logo
            </a>
          </Link>
          <Link href="/admin/database" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <Database /> Data og backup
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}
