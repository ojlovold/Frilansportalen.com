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
      alert("✅ Ferdig: " + JSON.stringify(data));
    } catch (err) {
      console.error("Feil:", err);
      alert("❌ fetch failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Opprett admin</h1>
      <button
        onClick={opprett}
        style={{ padding: 12, fontSize: 18, background: "black", color: "white" }}
      >
        Opprett ole@frilansportalen.com
      </button>
    </div>
  );
}
