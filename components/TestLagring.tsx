import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function TestLagring() {
  const supabase = useSupabaseClient();

  const testInsert = async () => {
    console.log("📤 Starter testinsert...");

    const { error } = await supabase.from("kvitteringer").insert([
      {
        bruker_id: "5c141119-628a-4316-9ccd-4f1e46c6b146",
        rolle: "admin",
        tittel: "Test fra TestLagring",
        belop: 123.45,
        valuta: "NOK",
        dato: "2025-05-30",
        fil_url: "https://dummy.pdf",
        opprettet: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("❌ FEIL VED INSERT:", error);
      alert("Feil: " + JSON.stringify(error, null, 2));
    } else {
      console.log("✅ Insert OK");
      alert("Kvittering lagret uten feil");
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <h2 className="text-lg font-semibold mb-2">TestLagring</h2>
      <button
        onClick={testInsert}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Kjør testinsert
      </button>
    </div>
  );
}
