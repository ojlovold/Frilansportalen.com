import { jsPDF } from "jspdf";
import supabase from "@/lib/supabaseClient";

export default function EksporterEpost({ brukerId }: { brukerId: string }) {
  const generer = async () => {
    const { data: meldinger } = await supabase
      .from("epost")
      .select("*")
      .or(`fra.eq.${brukerId},til.eq.${brukerId}`)
      .order("opprettet");

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text("Frilansportalen – E-postlogg", 10, y);
    y += 10;
    doc.setFontSize(10);

    for (const m of meldinger || []) {
      doc.text(`Fra: ${m.fra}`, 10, y); y += 6;
      doc.text(`Til: ${m.til}`, 10, y); y += 6;
      doc.text(`Emne: ${m.emne || "-"}`, 10, y); y += 6;
      doc.text(`Dato: ${new Date(m.opprettet).toLocaleString()}`, 10, y); y += 6;
      const innhold = m.innhold?.substring(0, 250) || "";
      doc.text(`Innhold: ${innhold}`, 10, y); y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`epostlogg_${Date.now()}.pdf`);
  };

  return (
    <button onClick={generer} className="text-sm underline text-blue-600">
      Last ned e-postlogg (PDF)
    </button>
  );
}
