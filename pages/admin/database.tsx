// pages/admin/database.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/layout/AdminLayout";

interface TabellInfo {
  name: string;
  count: number | null;
}

export default function AdminDatabase() {
  const [tabeller, setTabeller] = useState<TabellInfo[]>([]);

  useEffect(() => {
    const hentData = async () => {
      const { data, error } = await supabase.rpc("hent_tabellnavn");
      if (data && Array.isArray(data)) {
        const resultater: TabellInfo[] = await Promise.all(
          data.map(async (navn: string) => {
            const { count } = await supabase.from(navn).select("*", { count: "exact", head: true });
            return { name: navn, count: count ?? null };
          })
        );
        setTabeller(resultater);
      }
    };
    hentData();
  }, []);

  return (
    <AdminWrapper title="Data og backup">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">Oversikt over Supabase-tabeller og antall rader.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tabeller.map((tabell) => (
            <div key={tabell.name} className="bg-white p-4 rounded shadow">
              <p className="text-sm font-medium">{tabell.name}</p>
              <p className="text-xs text-gray-500">Rader: {tabell.count ?? "–"}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
