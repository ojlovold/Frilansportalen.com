// lib/ai/getProfileReachData.ts
import { User } from "@supabase/auth-helpers-nextjs";

export async function getProfileReachData(user: User | null): Promise<{
  reachScore: number;
  maxReach: number;
  tips: string[];
}> {
  if (!user) {
    return {
      reachScore: 0,
      maxReach: 100,
      tips: ["Du må være logget inn for å få analysert profilen."]
    };
  }

  // Dummydata – kobles til ekte analyse senere
  return {
    reachScore: 45,
    maxReach: 100,
    tips: [
      "Legg til flere ferdigheter i profilen din",
      "Last opp et profilbilde",
      "Fullfør beskrivelsen av tidligere prosjekter",
      "Legg inn tilgjengelighet og ønsket stillingsprosent"
    ]
  };
}
