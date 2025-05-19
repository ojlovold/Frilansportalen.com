import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LastOppKvittering() {
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const håndterFilvalg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFil(e.target.files[0]);
      setStatus("");
    }
  };

  const lastOpp = async () => {
    if (!fil) {
      setStatus("Ingen fil valgt.");
      return;
    }

    const safeFilename = fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

    const { error } = await supabase.storage
      .from("kvitteringer")
      .upload(`admin/${Date.now()}-${safeFilename}`, fil);

    if (error) {
      console.error("Feil ved opplasting:", error.message);
      setStatus("Feil ved opplasting: " + error.message);
    } else {
      setStatus("Kvittering lastet opp!");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-md">
      <h2 className="text-xl font-semibold mb-4">Last opp kvittering</h2>

      <input type="file" onChange={håndterFilvalg} className="mb-4" />
      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Last opp
      </button>

      {status && (
        <p className="mt-4 text-sm">
          {status}
        </p>
      )}
    </div>
  );
}
