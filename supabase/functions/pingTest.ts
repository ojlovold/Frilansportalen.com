import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  console.log("🟢 pingTest startet");

  const headers = req.headers;
  const token = headers.get("Authorization")?.replace("Bearer ", "") ?? "null";

  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {
    console.log("Ingen JSON-body mottatt");
  }

  const time = new Date().toISOString();

  console.log("🔹 Headers mottatt");
  console.log("🔹 Token:", token);
  console.log("🔹 Body:", body);
  console.log("✅ pingTest ferdig:", time);

  return new Response(
    JSON.stringify({
      status: "ok",
      melding: "pingTest kjørte OK",
      token,
      body,
      time,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});
