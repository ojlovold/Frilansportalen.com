// lib/redirectAfterLogin.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRouter } from "next/router";

export function redirectAfterLogin(userId: string, router: NextRouter) {
  // Midlertidig spesialtilfelle – gi tilgang direkte hvis ID matcher eier
  if (userId === "890ebf4a-bbdc-4424-be87-341c0b34972e") {
    router.push("/dashboard");
  } else {
    // Vanlig flyt: send bruker til utfyllingsside etter første innlogging
    router.push("/registrer");
  }
}
