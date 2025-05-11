import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function EksporterProsjekt({ prosjektId }: { prosjektId: string }) {
  const [status, setStatus] = useState("");

  const eksporter = async (format: "json" | "csv") => {
    setStatus("Laster data...");

    const { data: prosjekt } = await supabase
      .from("prosjekter")
      .select("*")
      .eq("id", prosjektId)
      .single();

    const { data: oppgaver } = await supabase
      .from("prosjektoppgaver")
      .select("*")
      .eq("prosjekt_id", prosjektId);

    const { data: deltakere } = await supabase
      .from("prosjektdeltakere")
      .select("*")
      .eq("prosjekt_id", prosjektId);

    const { data: notat } = await supabase
      .from("prosjektnotater")
      .select("innhold")
      .eq("prosjekt_id", prosjektId)
      .single();

    const samlet = {
      prosjekt,
      oppgaver,
      deltakere,
      notat: notat?.innhold || "",
      eksportert: new Date().toISOString(),
    };

    const filnavn = `prosjekt_${prosjektId}_${Date.now()}`;

    if (format === "json") {
      const blob = new Blob([JSON.stringify(samlet, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filnavn}.json`;
      a.click();
    }

    if (format === "csv") {
      const rader = [
        ["Prosjekt", prosjekt?.navn || ""],
        ["Status", prosjekt?.status || ""],
        ["Frist", prosjekt?.frist || ""],
        ["Antall oppgaver", oppgaver?.length || 0],
        ["Antall deltakere", deltakere?.length || 0],
        ["Notat", notat?.innhold?.replace(/\n/g, " ") || "-"],
      ];

      const csv = rader.map((r) => r.join(";")).join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filnavn}.csv`;
      a.click();
    }

    setStatus("Eksport fullført");
  };

  return (
    <div className="space-y-2 mt-10">
      <h3 className="text-lg font-bold">Eksport</h3>
      <div className="flex gap-4">
        <button onClick={() => eksporter("json")} className="bg-black text-white px-4 py-2 rounded">
          Last ned JSON
        </button>
        <button onClick={() => eksporter("csv")} className="bg-black text-white px-4 py-2 rounded">
          Last ned CSV
        </button>
      </div>
      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
