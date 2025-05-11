import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";

export default function Dashboard({ children }: { children: ReactNode }) {
  const user = useUser();
  const [ulestEposter, setUlestEposter] = useState(0);
  const [erAdmin, setErAdmin] = useState(false);

  useEffect(() => {
    const hentUleste = async () => {
      if (!user) return;
      const { count } = await supabase
        .from("epost")
        .select("*", { count: "exact", head: true })
        .eq("til", user.id)
        .eq("ulest", true)
        .not("slettet", "is", true);
      setUlestEposter(count || 0);
    };

    const sjekkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("brukerprofiler")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      setErAdmin(data?.is_admin || false);
    };

    hentUleste();
    sjekkAdmin();
  }, [user]);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <h1 className="text-2xl font-bold">Frilansportalen</h1>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-yellow-100 rounded">Dashboard</Link>
          <Link href="/profil" className="block px-4 py-2 hover:bg-yellow-100 rounded">Min profil</Link>
          <Link href="/dokumenter" className="block px-4 py-2 hover:bg-yellow-100 rounded">Mine dokumenter</Link>
          <Link href="/fakturainnstillinger" className="block px-4 py-2 hover:bg-yellow-100 rounded">Fakturainnstillinger</Link>
          <Link href="/epost" className="block px-4 py-2 hover:bg-yellow-100 rounded">
            E-post{ulestEposter > 0 ? ` (${ulestEposter})` : ""}
          </Link>
          <Link href="/kontrakter" className="block px-4 py-2 hover:bg-yellow-100 rounded">Kontrakter</Link>
          <Link href="/attester" className="block px-4 py-2 hover:bg-yellow-100 rounded">Attester</Link>
          <Link href="/fagbibliotek" className="block px-4 py-2 hover:bg-yellow-100 rounded">Fagbibliotek</Link>
          <Link href="/prosjektoversikt" className="block px-4 py-2 hover:bg-yellow-100 rounded">Prosjekter</Link>
          <Link href="/prosjektarkiv" className="block px-4 py-2 hover:bg-yellow-100 rounded">Prosjektarkiv</Link>

          {erAdmin && (
            <>
              <Link href="/admin/systemstatus" className="block px-4 py-2 hover:bg-yellow-100 rounded">Systemstatus</Link>
              <Link href="/admin/fagbibliotek" className="block px-4 py-2 hover:bg-yellow-100 rounded">Fagbibliotek Admin</Link>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 bg-portalGul text-black p-6">
        {children}
      </main>
    </div>
  );
}
