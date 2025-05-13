import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function EksporterKontraktPDF({ brukerId }: { brukerId: string }) {
  const [kontrakter, setKontrakter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("kontrakter")
        .select("*")
        .or(`oppretter.eq.${brukerId},mottaker.eq.${brukerId}`)
        .not("slettet", "is", true)
        .order("opprettet", { ascending: false });

      if (data) setKontrakter(data);
    };

    hent();
  }, [brukerId]);

  const eksporter = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Kontrakter – Frilansportalen", 10, 20);
    doc.setFontSize(10);

    kontrakter.forEach((k, i) => {
      const y = 30 + i * 30;
      doc.text(`Kontrakt: ${k.navn || k.id}`, 10, y);
      doc.text(`Signert: ${k.signert_oppretter ? "Ja" : "Nei"} / ${k.signert_mottaker ? "Ja" : "Nei"}`, 10, y + 6);
      doc.text(`Opprettet: ${new Date(k.opprettet).toLocaleDateString("no-NO")}`, 10, y + 12);
      doc.text(`URL: ${k.fil_url}`, 10, y + 18);
    });

    doc.save(`mine_kontrakter.pdf`);
  };

  if (kontrakter.length === 0) return null;

  return (
    <button onClick={eksporter} className="text-sm underline text-blue-600">
      Eksporter alle til PDF
    </button>
  );
}
