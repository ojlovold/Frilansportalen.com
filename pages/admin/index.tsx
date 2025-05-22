import Head from "next/head";
import Link from "next/link";
import {
  Settings,
  Users,
  ShieldCheck,
  Palette,
  Database,
  FileText,
} from "lucide-react";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

const supabase = createBrowserSupabaseClient();

export default function AdminPanel() {
  useEffect(() => {
    const sjekkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) window.location.href = "/admin/logginn";
    };
    sjekkAuth();
  }, []);

  const loggUt = async () => {
    await supabase.auth.signOut();
    setTimeout(() => {
      window.location.href = "/admin/logginn";
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Adminpanel</h1>
          <button
            onClick={loggUt}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logg ut
          </button>
        </div>

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
          <Link href="/admin/arv" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <ShieldCheck /> Arverett og eierskap
            </a>
          </Link>
          <Link href="/admin/regnskap" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4">
              <FileText /> Regnskap og rapport
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}
