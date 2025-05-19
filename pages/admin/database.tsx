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
  const [eksporterer, setEksporterer] = useState<string | null>(null);

  useEffect(() => {
    const hentData = async () => {
      const { data } = await supabase.rpc("hent_tabellnavn");
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

  const lastNedJSON = async (tabell: string) => {
    setEksporterer(tabell);
    const { data } = await supabase.from(tabell).select("*");
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tabell}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(`Kunne ikke hente data fra ${tabell}`);
    }
    setEksporterer(null);
  };

  const lastNedCSV = async (tabell: string) => {
    setEksporterer(tabell);
    const { data } = await supabase.from(tabell).select("*");
    if (data && data.length > 0) {
      const header = Object.keys(data[0]).join(",");
      const rows = data.map((row) =>
        Object.values(row).map((v) => `"${(v ?? "").toString().replaceAll("\"", '""')}"`).join(",")
      );
      const csvContent = [header, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tabell}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(`Ingen data i ${tabell}`);
    }
    setEksporterer(null);
  };

  return (
    <AdminWrapper title="Data og backup">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">Last ned data fra Supabase som JSON eller CSV.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tabeller.map((tabell) => (
            <div key={tabell.name} className="bg-white p-4 rounded shadow space-y-2">
              <p className="text-sm font-medium">{tabell.name}</p>
              <p className="text-xs text-gray-500">Rader: {tabell.count ?? "–"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => lastNedJSON(tabell.name)}
                  className="text-sm bg-black text-white px-3 py-1 rounded"
                  disabled={eksporterer === tabell.name}
                >
                  {eksporterer === tabell.name ? "Henter..." : "Last ned JSON"}
                </button>
                <button
                  onClick={() => lastNedCSV(tabell.name)}
                  className="text-sm bg-black text-white px-3 py-1 rounded"
                  disabled={eksporterer === tabell.name}
                >
                  {eksporterer === tabell.name ? "Henter..." : "Last ned CSV"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
