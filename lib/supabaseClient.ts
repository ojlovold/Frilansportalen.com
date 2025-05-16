import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createBrowserSupabaseClient({
  persistSession: true,
  autoRefreshToken: true,
});
