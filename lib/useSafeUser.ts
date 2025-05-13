// lib/useSafeUser.ts
import { useUser as useSupabaseUser } from "@supabase/auth-helpers-react";

export const useSafeUser = () => {
  try {
    return useSupabaseUser();
  } catch (error) {
    console.warn("useUser() failed: ", error);
    return { user: null, error };
  }
};
