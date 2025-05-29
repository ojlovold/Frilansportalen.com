import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ResetPassword() {
  const supabase = useSupabaseClient();
  const [nyttPassord, setNyttPassord] = useState("");
  const [klar, setKlar] = useState(false);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const fragment = window.location.hash;
    if (fragment.includes("access_token")) {
      const query = new URLSearchParams(fragment.replace("#", "?"));
      const access_token = query.get("access_token");
      const refresh_token = query.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          setKlar(true);
        });
      }
    }
  }, []);

  const lagre = async () => {
    const { error } = await supabase.auth.updateUser({ password: nyttPassord });
    if (error) {
      setMelding("❌ " + error.message);
    } else {
      setMelding("✅ Passord oppdatert!");
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
        style={{ padding: 8 }}
      />
      <button onClick={lagre} style={{ marginTop: 10, padding: 8 }} disabled={!klar}>
        Lagre nytt passord
      </button>
      <p style={{ marginTop: 10 }}>{melding}</p>
    </div>
  );
}
