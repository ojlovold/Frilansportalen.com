import { jsPDF } from "jspdf";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";

export default function EksporterProsjektlogg({ prosjektId }: { prosjektId: string }) {
  const [status, setStatus] = useState("");

  const generer = async () => {
    setStatus("Laster data...");

    const { data: chat } = await supabase
      .from("prosjektmeldinger")
      .select("*")
      .eq("prosjekt_id", prosjektId)
      .order("opprettet", { ascending: true });

    const { data: filer } = await supabase
      .from("prosjektfiler")
      .select("*")
      .eq("prosjekt_id", prosjektId)
      .order("opplastet", { ascending: true });

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text("Frilansportalen – Prosjektlogg", 10, y); y += 10;
    doc.setFontSize(11);
    doc.text(`Prosjekt-ID: ${prosjektId}`, 10, y); y += 8;

    // Chat
    doc.setFontSize(12);
    doc.text("Chatlogg", 10, y); y += 8;
    doc.setFontSize(10);

    for (const m of chat || []) {
      doc.text(`${m.avsender_id} – ${new Date(m.opprettet).toLocaleString()}`, 10, y); y += 5;
      const linjer = doc.splitTextToSize(m.innhold || "-", 180);
      doc.text(linjer, 10, y);
      y += linjer.length * 5 + 4;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    y += 6;
    doc.setFontSize(12);
    doc.text("Fildeling", 10, y); y += 8;
    doc.setFontSize(10);

    for (const f of filer || []) {
      doc.text(`• ${f.filnavn}`, 10, y); y += 5;
      const url = f.url?.substring(0, 100) || "-";
      doc.text(`  ${url}`, 10, y); y += 6;
      doc.text(`  Opplastet: ${new Date(f.opplastet).toLocaleDateString()}`, 10, y); y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`prosjektlogg_${prosjektId}_${Date.now()}.pdf`);
    setStatus("PDF eksportert");
  };

  return (
    <div className="space-y-2 mt-6">
      <button onClick={generer} className="bg-black text-white px-4 py-2 rounded">
        Last ned prosjektlogg (PDF)
      </button>
      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
