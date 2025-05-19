// components/ProfilRadar.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/useUser";
import { getProfileReachData } from "@/lib/ai/getProfileReachData";

export default function ProfilRadar() {
  const { user } = useUser();
  const [profilData, setProfilData] = useState<{
    reachScore: number;
    maxReach: number;
    tips: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const hentRadar = async () => {
    setLoading(true);
    const response = await getProfileReachData(user);
    setProfilData(response);
    setLoading(false);
  };

  useEffect(() => {
    hentRadar();
  }, []);

  const prosent = profilData
    ? Math.round((profilData.reachScore / profilData.maxReach) * 100)
    : 0;

  return (
    <Card className="mb-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Profilens rekkevidde</h2>
        {loading ? (
          <p>Laster rekkeviddedata...</p>
        ) : profilData ? (
          <>
            <Progress value={prosent} />
            <p className="text-sm">{`Din profil er ${prosent}% så synlig som den kunne vært.`}</p>
            <ul className="list-disc list-inside text-sm">
              {profilData.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <Button onClick={hentRadar} disabled={loading}>
              Oppdater
            </Button>
          </>
        ) : (
          <p>Kunne ikke hente data for profilen din.</p>
        )}
      </CardContent>
    </Card>
  );
}
