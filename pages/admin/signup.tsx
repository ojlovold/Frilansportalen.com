import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSignupTest() {
  const registrer = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: "ole@frilansportalen.com",
        password: "@Bente01",
      });

      if (error) return alert("❌ Feil: " + error.message);
      alert("✅ Opprettet: " + JSON.stringify(data.user?.email || "OK"));
    } catch (err: any) {
      alert("💥 Fetch-feil: " + err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Rå signup test</h1>
      <button onClick={registrer}>Registrer bruker direkte</button>
    </div>
  );
}
