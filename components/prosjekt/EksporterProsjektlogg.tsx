import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function EksporterProsjektlogg({ prosjektId }: { prosjektId: string }) {
  const [status, setStatus] = useState("");

  const eksporter = async () => {
    setStatus("Eksporterer...");

    const { data, error } = await supabase
      .from("prosjektlogg")
      .select("*")
      .eq("prosjekt_id", prosjektId);

    if (error || !data) {
      setStatus("Feil ved eksport.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Prosjektlogg", 14, 20);

    let y = 30;
    data.forEach((logg, i) => {
      doc.text(`- ${logg.tidspunkt}: ${logg.beskrivelse}`, 14, y);
      y += 10;
    });

    doc.save(`prosjektlogg_${prosjektId}.pdf`);
    setStatus("Eksport fullført.");
  };

  return (
    <div>
      <button
        onClick={eksporter}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Eksporter prosjektlogg
      </button>
      <p className="mt-2 text-sm text-gray-700">{status}</p>
    </div>
  );
}
