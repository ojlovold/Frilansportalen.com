export default function TestOppretting() {
  const opprett = async () => {
    try {
      const res = await fetch("/api/opprettBruker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ole@frilansportalen.com",
          password: "@Bente01"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ FEIL: " + (data.error || "ukjent"));
      } else {
        alert("✅ Bruker opprettet: " + JSON.stringify(data.user?.email || "OK"));
      }
    } catch (err) {
      console.error("Feil:", err);
      alert("❌ fetch failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Test brukeropprettelse</h1>
      <button
        onClick={opprett}
        style={{
          padding: 12,
          fontSize: 18,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 6,
        }}
      >
        Opprett admin nå
      </button>
    </div>
  );
}
