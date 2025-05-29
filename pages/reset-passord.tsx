import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ResetPassord() {
  const supabase = useSupabaseClient();
  const [nyttPassord, setNyttPassord] = useState("");
  const [melding, setMelding] = useState("");

  const lagre = async () => {
    const { error } = await supabase.auth.updateUser({
      password: nyttPassord,
    });

    if (error) {
      setMelding("Feil: " + error.message);
    } else {
      setMelding("✅ Passord oppdatert! Du kan nå logge inn.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Oppdater passord</h1>
      <input
        type="password"
        placeholder="Nytt passord"
        value={nyttPassord}
        onChange={(e) => setNyttPassord(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 12 }}
      />
      <button onClick={lagre} style={{ padding: 10 }}>
        Lagre nytt passord
      </button>
      <p>{melding}</p>
    </div>
  );
}
