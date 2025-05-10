import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Header() {
  const [harVarsel, setHarVarsel] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sjekkVarsler = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("varsler")
        .select("id")
        .eq("bruker_id", id)
        .eq("lest", false);

      if (data && data.length > 0) {
        setHarVarsel(true);
      }
    };

    sjekkVarsler();
  }, [router]);

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="block text-2xl font-extrabold tracking-tight">
          <span className="mr-1">FRILANS</span>
          <span className="font-light">PORTALEN</span>
        </Link>

        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mt-4 sm:mt-0 items-center">
          <Link href="/stillinger">Stillinger</Link>
          <Link href="/tjenester">Tjenester</Link>
          <Link href="/gjenbruk">Gjenbruk</Link>
          <Link href="/kurs">Kurs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <div className="relative">
            <Link href="/varsler">Varsler</Link>
            {harVarsel && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" title="Nytt varsel"></span>
            )}
          </div>
          <Link href="/profil">
            <button className="bg-white text-black px-3 py-1 rounded text-xs hover:bg-gray-200">Profil</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
