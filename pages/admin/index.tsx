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
import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [tilgang, setTilgang] = useState(false);

  useEffect(() => {
    const erBypasset = localStorage.getItem("admin") === "true";
    if (user || erBypasset) {
      setTilgang(true);
    } else {
      router.push("/admin-bypass");
    }
  }, [user, router]);

  const loggUt = async () => {
    localStorage.removeItem("admin");
    await supabase.auth.signOut();
    router.push("/admin-bypass");
  };

  if (!tilgang) return null;

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
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logg ut
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/admin/brukere" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <Users /> Brukere og profiler
            </a>
          </Link>
          <Link href="/admin/integrasjoner" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <Settings /> Vipps og Altinn
            </a>
          </Link>
          <Link href="/admin/systemstatus" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <ShieldCheck /> Systemstatus
            </a>
          </Link>
          <Link href="/admin/design" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <Palette /> Farger og logo
            </a>
          </Link>
          <Link href="/admin/database" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <Database /> Data og backup
            </a>
          </Link>
          <Link href="/admin/arv" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <ShieldCheck /> Arverett og eierskap
            </a>
          </Link>
          <Link href="/admin/regnskap" legacyBehavior>
            <a className="bg-[#e5e5e5] rounded-2xl shadow p-6 flex items-center gap-4 hover:bg-[#d4d4d4] transition-colors">
              <FileText /> Regnskap og rapport
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}
