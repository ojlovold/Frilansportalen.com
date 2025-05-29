import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Signup() {
  const supabase = useSupabaseClient();

  const registrer = async () => {
    const { error } = await supabase.auth.signUp({
      email: "ole@frilansportalen.com",
      password: "@Bente01",
    });

    if (error) {
      alert("❌ Feil: " + error.message);
    } else {
      alert("✅ Bruker opprettet!");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Registrer admin</h1>
      <button onClick={registrer} style={{ padding: 12 }}>
        Opprett bruker
      </button>
    </div>
  );
}
