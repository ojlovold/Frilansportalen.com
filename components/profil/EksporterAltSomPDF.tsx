import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { jsPDF } from "jspdf";

export default function EksporterAltSomPDF({ brukerId }: { brukerId: string }) {
  const [klar, setKlar] = useState(false);

  useEffect(() => {
    setKlar(true);
  }, []);

  const generer = async () => {
    const { data: profil } = await supabase
      .from("brukerprofiler")
      .select("*")
      .eq("id", brukerId)
      .single();

    const { data: attester } = await supabase
      .from("attester")
      .select("*")
      .eq("bruker_id", brukerId);

    const { data: kontrakter } = await supabase
      .from("kontrakter")
      .select("*")
      .or(`oppretter.eq.${brukerId},mottaker.eq.${brukerId}`);

    const { data: prosjekter } = await supabase
      .from("prosjekter")
      .select("*")
      .or(`eier_id.eq.${brukerId}`);

    const { data: cv } = await supabase
      .from("dokumenter")
      .select("*")
      .eq("bruker_id", brukerId)
      .eq("type", "CV")
      .limit(1)
      .single();

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Frilansportalen – Brukerrapport", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Personalia", 10, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Navn: ${profil?.navn || "-"}`, 10, y); y += 6;
    doc.text(`E-post: ${profil?.epost || "-"}`, 10, y); y += 6;
    doc.text(`Telefon: ${profil?.telefon || "-"}`, 10, y); y += 6;
    doc.text(`Adresse: ${profil?.adresse || "-"}`, 10, y); y += 10;

    if (cv) {
      doc.setFontSize(12);
      doc.text("CV", 10, y); y += 8;
      doc.setFontSize(10);
      doc.text(`Filnavn: ${cv.filnavn}`, 10, y); y += 6;
      doc.text(`URL: ${cv.url}`, 10, y); y += 10;
    }

    doc.setFontSize(12);
    doc.text("Attester", 10, y); y += 8;
    doc.setFontSize(10);
    attester?.forEach((a: { type: string; filnavn: string; utløper: string }) => {
      doc.text(
        `• ${a.type} (${a.filnavn}) – utløper: ${new Date(a.utløper).toLocaleDateString()}`,
        10,
        y
      );
      y += 6;
    });

    y += 6;
    doc.setFontSize(12);
    doc.text("Kontrakter", 10, y); y += 8;
    doc.setFontSize(10);
    kontrakter?.forEach((k: { filnavn: string; status: string }) => {
      doc.text(`• ${k.filnavn} – status: ${k.status}`, 10, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(12);
    doc.text("Prosjekter", 10, y); y += 8;
    doc.setFontSize(10);
    prosjekter?.forEach((p: { navn: string; status: string; frist: string }) => {
      doc.text(
        `• ${p.navn} – status: ${p.status} – frist: ${new Date(p.frist).toLocaleDateString()}`,
        10,
        y
      );
      y += 6;
    });

    doc.save(`frilansrapport_${Date.now()}.pdf`);
  };

  if (!klar) return null;

  return (
    <button onClick={generer} className="bg-black text-white px-4 py-2 rounded">
      Last ned samlet PDF-rapport
    </button>
  );
}
