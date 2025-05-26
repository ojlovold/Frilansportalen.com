// supabase/functions/leggTilKvittering.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!jwt) {
    return new Response("Manglende token", { status: 401 });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) {
    return new Response("Ikke autentisert", { status: 401 });
  }

  const body = await req.json();
  const { tittel, belop, valuta, dato, fil_url, rolle } = body;

  const { error: insertError } = await supabase.from("kvitteringer").insert([
    {
      bruker_id: user.id,
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
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
