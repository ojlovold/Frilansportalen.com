import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function CVUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const uploadCV = async () => {
    if (!file) return;
    const { error } = await supabase.storage
      .from("cv")
      .upload(`${userId}/cv.pdf`, file, { upsert: true });
    setStatus(error ? "Feil ved opplasting" : "CV lastet opp!");
  };

  return (
    <div className="space-y-2">
      <label className="block">Last opp CV (PDF):</label>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button className="bg-black text-white p-2 rounded" onClick={uploadCV}>Last opp</button>
      <p>{status}</p>
    </div>
  );
}
