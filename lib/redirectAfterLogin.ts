// lib/redirectAfterLogin.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRouter } from "next/router";

export async function redirectAfterLogin(router: NextRouter) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return router.push("/");

  const { data: profil } = await supabase
    .from("profiler")
    .select("navn")
    .eq("id", user.id)
    .single();

  if (!profil || !profil.navn || profil.navn.trim() === "") {
    return router.push("/profil-info");
  } else {
    return router.push("/dashboard");
  }
}
