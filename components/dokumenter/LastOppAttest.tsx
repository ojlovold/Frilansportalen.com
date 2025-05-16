import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LastOppAttest() {
  const user = useUser();
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const lastOpp = async () => {
    if (!user || !fil) {
      setStatus("Du må være innlogget og velge en fil.");
      return;
    }

    const filnavn = `${user.id}/${Date.now()}-${fil.name}`;

    const { error } = await supabase.storage
      .from("attester")
      .upload(filnavn, fil);

    if (error) {
      setStatus("Feil ved opplasting: " + error.message);
    } else {
      setStatus("Attest lastet opp!");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Last opp attest</h2>

      <input
        type="file"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Last opp
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
