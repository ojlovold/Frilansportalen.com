import jsPDF from "jspdf";
import { supabase } from "./supabaseClient";

export async function lagKvittering(userId: string, type: string, belop: number) {
  const { data: profil } = await supabase
    .from("profiler")
    .select("navn, epost")
    .eq("id", userId)
    .single();

  const dato = new Date().toLocaleDateString("no-NO");
  const fakturanr = `KV-${Date.now()}`;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Kvittering", 20, 20);

  doc.setFontSize(10);
  doc.text(`Kjøper: ${profil?.navn}`, 20, 32);
  doc.text(`E-post: ${profil?.epost}`, 20, 38);
  doc.text(`Dato: ${dato}`, 20, 44);
  doc.text(`Kjøp: ${type}`, 20, 50);
  doc.text(`Beløp: ${belop.toFixed(2)} kr`, 20, 56);
  doc.text(`Kvitteringsnummer: ${fakturanr}`, 20, 62);

  const buffer = doc.output("arraybuffer");
  const filnavn = `kvittering-${fakturanr}.pdf`;

  await supabase.storage.from("kvitteringer").upload(filnavn, buffer, {
    contentType: "application/pdf",
    upsert: false,
  });

  await supabase.from("kvitteringer").insert({
    bruker_id: userId,
    navn: filnavn,
    type,
    belop,
    dato: new Date().toISOString(),
  });

  return true;
}
