import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  console.log("Funksjon startet: leggTilKvittering");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) return new Response("Manglende token", { status: 401 });

  const body = await req.json();
  const { rolle, tittel, belop, valuta, dato, fil_url, bruker_id: innsendtBrukerId } = body;

  let bruker_id = "";

  if (rolle === "admin" && innsendtBrukerId) {
    bruker_id = innsendtBrukerId;
  } else {
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) return new Response("Feil ved auth", { status: 401 });
    bruker_id = user.id;
  }

  const { error: insertError } = await supabase.from("kvitteringer").insert([
    {
      bruker_id,
      rolle,
      tittel,
      belop,
      valuta,
      dato,
      fil_url,
      opprettet: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    console.log("Feil ved insert:", insertError.message);
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  console.log("Kvittering lagret OK for bruker", bruker_id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
