import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function FileUpload({
  onUpload,
  folder = "opplastinger"
}: {
  onUpload: (url: string) => void;
  folder?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!e.target.files || e.target.files.length === 0) {
        alert("Velg en fil først.");
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("kontrakter")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("kontrakter").getPublicUrl(filePath);
      if (data?.publicUrl) onUpload(data.publicUrl);
    } catch (error) {
      alert("Feil ved opplasting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleUpload}
        className="text-sm"
      />
      {loading && <p className="text-xs mt-2">Laster opp...</p>}
    </div>
  );
}
