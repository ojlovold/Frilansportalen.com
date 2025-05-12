import { jsPDF } from "jspdf";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";

interface Epost {
  fra: string;
  til: string;
  emne?: string;
  innhold?: string;
  opprettet: string;
}

export default function EksporterEpost({ brukerId }: { brukerId: string }) {
  const [sok, setSok] = useState("");
  const [status, setStatus] = useState("");

  const generer = async () => {
    setStatus("Henter meldinger...");

    const { data: meldinger } = await supabase
      .from("epost")
      .select("*")
      .or(`fra.eq.${brukerId},til.eq.${brukerId}`)
      .order("opprettet", { ascending: true })
      .limit(1000);

    const filtrert = (meldinger || []).filter((m: Epost) => {
      const tekst = `${m.emne || ""} ${m.innhold || ""}`.toLowerCase();
      return tekst.includes(sok.toLowerCase());
    });

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text("Frilansportalen – E-postlogg", 10, y);
    y += 10;

    doc.setFontSize(10);
    filtrert.forEach((m: Epost, i) => {
      doc.setDrawColor(200);
      doc.line(10, y - 2, 200, y - 2);
      doc.text(`Fra: ${m.fra}`, 10, y); y += 5;
      doc.text(`Til: ${m.til}`, 10, y); y += 5;
      doc.text(`Emne: ${m.emne || "-"}`, 10, y); y += 5;
      doc.text(`Dato: ${new Date(m.opprettet).toLocaleString()}`, 10, y); y += 5;

      const tekst = m.innhold?.substring(0, 500) || "";
      const linjer = doc.splitTextToSize(tekst, 180);
      doc.text(linjer, 10, y);
      y += linjer.length * 5 + 5;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`epostlogg_${Date.now()}.pdf`);
    setStatus("Eksport fullført");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Søk i emne/innhold"
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={generer} className="bg-black text-white px-4 py-2 rounded">
          Last ned PDF
        </button>
      </div>
      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
