import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

interface Bruker {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminBrukere() {
  const [brukere, setBrukere] = useState<Bruker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hentBrukere = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (data?.users) {
        const transformert = data.users.map((user) => ({
          id: user.id,
          email: user.email ?? "(ukjent)",
          created_at: user.created_at ?? "",
        }));
        setBrukere(transformert);
      }
      setLoading(false);
    };
    hentBrukere();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Alle brukere</h2>
      {loading ? (
        <p>Laster brukere...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brukere.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 space-y-1">
                <p className="text-sm font-medium">{b.email}</p>
                <p className="text-xs text-gray-600">ID: {b.id}</p>
                <p className="text-xs text-gray-600">
                  Opprettet: {new Date(b.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
