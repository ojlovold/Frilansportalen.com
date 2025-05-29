import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Signup() {
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
      <button onClick={registrer}>Opprett bruker</button>
    </div>
  );
}
