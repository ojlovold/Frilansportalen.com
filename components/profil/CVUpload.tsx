import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CVUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    if (!file) {
      setStatus("Velg en fil først.");
      return;
    }

    const path = `cv/${userId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cv")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setStatus("Feil ved opplasting: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("cv").getPublicUrl(path);

    const { error } = await supabase
      .from("brukerprofiler")
      .update({ cv_url: urlData.publicUrl })
      .eq("id", userId);

    if (error) {
      setStatus("Feil ved lagring: " + error.message);
    } else {
      setFile(null);
      setStatus("CV lastet opp!");
    }
  };

  return (
    <div className="bg-white p-4 border rounded shadow space-y-4">
      <h2 className="text-lg font-bold">Last opp CV</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        onClick={upload}
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        Last opp
      </button>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
}
