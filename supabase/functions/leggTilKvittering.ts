// supa/functions/leggTilKvittering.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response("Bruker ikke funnet", { status: 401 });
    }

    const body = await req.json();
    const { tittel, belop, valuta, dato, fil_url, rolle } = body;

    const { error: insertError } = await supabaseClient.from("kvitteringer").insert([
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
  } catch (err) {
    return new Response(JSON.stringify({ error: "Uventet feil", detalj: err.message }), {
      status: 500,
    });
  }
});
