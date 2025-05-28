import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  console.log("Funksjon startet: leggTilKvittering");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) {
    console.log("Token mangler");
    return new Response("Manglende token", { status: 401 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  const body = await req.json();
  const { tittel, belop, valuta, dato, fil_url, rolle, bruker_id: innsendtBrukerId } = body;

  let bruker_id = "";

  if (rolle === "admin" && innsendtBrukerId) {
    bruker_id = innsendtBrukerId;
  } else if (user?.id) {
    bruker_id = user.id;
  } else {
    console.log("Ingen gyldig bruker_id funnet");
    return new Response("Mangler bruker_id", { status: 401 });
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
