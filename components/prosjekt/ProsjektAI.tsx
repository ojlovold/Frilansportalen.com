import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function ProsjektAI({ prosjektId }: { prosjektId: string }) {
  const [forslag, setForslag] = useState<string[]>([]);
  const [laster, setLaster] = useState(false);

  useEffect(() => {
    const hent = async () => {
      setLaster(true);

      const { data: prosjekt } = await supabase
        .from("prosjekter")
        .select("navn, beskrivelse, frist")
        .eq("id", prosjektId)
        .single();

      const { data: oppgaver } = await supabase
        .from("prosjektoppgaver")
        .select("tittel, ansvarlig_id, status")
        .eq("prosjekt_id", prosjektId);

      const oppgaveliste = oppgaver
        ?.map((o: { tittel: string; status: string; ansvarlig_id?: string }) =>
          `• ${o.tittel} – ${o.status} – ansvarlig: ${o.ansvarlig_id || "Ingen"}`
        )
        .join("\n") || "";

      const prompt = `
Prosjektnavn: ${prosjekt?.navn}
Beskrivelse: ${prosjekt?.beskrivelse}
Frist: ${prosjekt?.frist}
Oppgaver:
${oppgaveliste}

Basert på dette, gi 3 konkrete forslag for å forbedre fremdriften. Ikke gjenta oppgavetitlene. Skriv i punktform, på norsk.`;

      const response = await fetch("/api/ai-forslag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await response.json();
      setForslag(json.result?.split("\n").filter((l: string) => l.trim()) || []);
      setLaster(false);
    };

    hent();
  }, [prosjektId]);

  return (
    <div className="space-y-4 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">AI-assistent</h3>
      {laster ? (
        <p>Laster forslag...</p>
      ) : forslag.length > 0 ? (
        <ul className="list-disc list-inside text-black space-y-1">
          {forslag.map((f, i) => (
            <li key={i}>{f.replace(/^• /, "")}</li>
          ))}
        </ul>
      ) : (
        <p>Ingen forslag tilgjengelig.</p>
      )}
    </div>
  );
}
