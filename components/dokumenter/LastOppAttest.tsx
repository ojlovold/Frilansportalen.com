import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";

export default function LastOppAttest() {
  const { user } = useUser();
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const håndterFilvalg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valgt = e.target.files?.[0] || null;
    setFil(valgt);
  };

  const lastOpp = async () => {
    if (!user?.id || !fil) {
      setStatus("Du må være logget inn og velge en fil.");
      return;
    }

    const filsti = `${user.id}/${Date.now()}_${fil.name}`;

    const { error } = await supabase.storage
      .from("attester")
      .upload(filsti, fil, {
        contentType: fil.type,
        upsert: true
      });

    if (error) {
      setStatus("Feil ved opplasting: " + error.message);
    } else {
      setStatus("Attesten er lastet opp!");
      setFil(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Last opp attest (PDF eller bilde):</label>
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={håndterFilvalg}
        className="mb-2"
      />
      <button
        onClick={lastOpp}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Last opp
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
