import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Hendelse {
  id: string;
  tittel: string;
  type: string;
  dato: string;
}

export default function ProsjektKalender({ prosjektId }: { prosjektId: string }) {
  const [hendelser, setHendelser] = useState<Hendelse[]>([]);

  useEffect(() => {
    const hent = async () => {
      const samlet: Hendelse[] = [];

      const { data: prosjekt } = await supabase
        .from("prosjekter")
        .select("frist, navn")
        .eq("id", prosjektId)
        .single();

      if (prosjekt?.frist) {
        samlet.push({
          id: "p-frist",
          tittel: `Prosjektfrist: ${prosjekt.navn}`,
          type: "Prosjekt",
          dato: prosjekt.frist,
        });
      }

      const { data: oppgaver } = await supabase
        .from("prosjektoppgaver")
        .select("id, tittel, frist")
        .eq("prosjekt_id", prosjektId);

      for (const o of oppgaver || []) {
        if (o.frist)
          samlet.push({
            id: `oppgave-${o.id}`,
            tittel: `Oppgave: ${o.tittel}`,
            type: "Oppgave",
            dato: o.frist,
          });
      }

      const { data: ekstra } = await supabase
        .from("prosjektkalender")
        .select("id, tittel, starttid")
        .eq("prosjekt_id", prosjektId);

      for (const h of ekstra || []) {
        samlet.push({
          id: h.id,
          tittel: h.tittel,
          type: "Hendelse",
          dato: h.starttid,
        });
      }

      setHendelser(samlet.sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime()));
    };

    hent();
  }, [prosjektId]);

  return (
    <div className="space-y-4 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">Prosjektkalender</h3>

      {hendelser.length === 0 ? (
        <p>Ingen frister eller hendelser registrert.</p>
      ) : (
        <ul className="space-y-2 text-black">
          {hendelser.map((h) => (
            <li key={h.id} className="text-sm">
              <strong>{new Date(h.dato).toLocaleDateString()}</strong>: {h.tittel} ({h.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
