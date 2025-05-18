// pages/admin/index.tsx
import Head from "next/head";
import Link from "next/link";
import {
  Settings,
  Users,
  FileText,
  ShieldCheck,
  FileCog,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
          <Link href="/admin/skjemaer" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <FileText /> Skjemabank
            </a>
          </Link>
          <Link href="/admin/firmadokumenter" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <FileCog /> Firmadokumenter
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
