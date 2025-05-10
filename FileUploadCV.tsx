import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function FileUploadCV({ onUpload }: { onUpload: (url: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!e.target.files || e.target.files.length === 0) {
        alert("Velg en fil først.");
        return;
      }

      const file = e.target.files[0];
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}.${ext}`;
      const path = `cv/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("cv-filer")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("cv-filer").getPublicUrl(path);
      if (data?.publicUrl) onUpload(data.publicUrl);
    } catch {
      alert("Feil ved opplasting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleUpload} />
      {loading && <p className="text-xs mt-2">Laster opp...</p>}
    </div>
  );
}
