// components/dokumenter/LastOppAttest.tsx
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../../lib/supabaseClient"; // ← Riktig import

export default function LastOppAttest() {
  const { user } = useUser();
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const håndterFilvalg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFil(e.target.files[0]);
    }
  };

  const lastOpp = async () => {
    if (!fil || !user) {
      setStatus("Fil eller bruker mangler.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("attester")
      .upload(`${user.id}/${fil.name}`, fil, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      setStatus(`Feil ved opplasting: ${error.message}`);
    } else {
      setStatus("Attest lastet opp!");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={håndterFilvalg}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0
          file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
      />
      <button
        onClick={lastOpp}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Last opp attest
      </button>
      {status && <p className="text-sm text-red-600">{status}</p>}
    </div>
  );
}
