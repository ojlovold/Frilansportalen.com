import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) return new Response("Manglende token", { status: 401 });

  const body = await req.json();
  const { rolle, tittel, belop, valuta, dato, type, kilde, bruker_id: innsendtBrukerId } = body;

  let bruker_id = "";

  if (rolle === "admin" && innsendtBrukerId) {
    bruker_id = innsendtBrukerId;
  } else {
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) return new Response("Feil ved auth", { status: 401 });
    bruker_id = user.id;
  }

  const { error: insertError } = await supabase.from("regnskap").insert({
    bruker_id,
    tittel,
    belop,
    valuta,
    dato,
    type,
    kilde,
  });

  return insertError
    ? new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
    : new Response(JSON.stringify({ status: "ok" }), { status: 200 });
});
