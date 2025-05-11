import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LastOppDokument({ userId }: { userId: string }) {
  const [fil, setFil] = useState<File | null>(null);
  const [type, setType] = useState("CV");
  const [utløper, setUtløper] = useState("");
  const [status, setStatus] = useState("");

  const lastOpp = async () => {
    if (!fil) return;

    const path = `${userId}/${Date.now()}_${fil.name}`;
    const { data, error } = await supabase.storage.from("dokumenter").upload(path, fil);

    if (error) return setStatus("Opplasting feilet");

    const url = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;

    await supabase.from("dokumenter").insert([{
      bruker_id: userId,
      type,
      utløper: utløper || null,
      url
    }]);

    setStatus("Lastet opp!");
    setFil(null);
    setType("CV");
    setUtløper("");
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Last opp nytt dokument</h2>
      <input type="file" onChange={e => setFil(e.target.files?.[0] || null)} />
      <select value={type} onChange={e => setType(e.target.value)} className="block w-full p-2 border rounded">
        <option value="CV">CV</option>
        <option value="Helseattest">Helseattest</option>
        <option value="Sertifikat">Sertifikat</option>
        <option value="Annet">Annet</option>
      </select>
      <input
        type="date"
        value={utløper}
        onChange={e => setUtløper(e.target.value)}
        className="block w
