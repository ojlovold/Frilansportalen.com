import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function FileUploadProfil({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!e.target.files || e.target.files.length === 0) {
        alert("Velg et bilde først.");
        return;
      }

      const file = e.target.files[0];
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}.${ext}`;
      const path = `profil/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("profilbilder")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("profilbilder").getPublicUrl(path);
      if (data?.publicUrl) onUpload(data.publicUrl);
    } catch {
      alert("Feil ved opplasting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p className="text-xs mt-2">Laster opp bilde...</p>}
    </div>
  );
}
