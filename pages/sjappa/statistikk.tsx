import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/supabase-js';
import Dashboard from '@/components/Dashboard';  // Juster import-sti etter prosjektstruktur

const StatistikkPage: React.FC = () => {
  // Hent innlogget bruker (caste til Supabase User for å unngå TS-konflikt)
  const { user } = useUser();
  const supabaseUser = user as unknown as User;
  const userId = supabaseUser?.id;

  // State for annonser-statistikk
  const [totalAds, setTotalAds] = useState<number | null>(null);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Supabase klient (forutsatt at SessionContextProvider er satt opp i _app.tsx)
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Ikke hent data hvis bruker ikke er innlogget
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAdStats = async () => {
      try {
        // Hent alle annonser opprettet av denne brukeren
        const { data, error } = await supabase
          .from('annonser')
          .select('type')
          .eq('user_id', userId);  // anta at kolonnen for brukerens ID heter 'user_id'
        
        if (error) {
          throw error;
        }
        if (data) {
          // Beregn totalt antall annonser og antall per type
          setTotalAds(data.length);
          const counts: Record<string, number> = {};
          data.forEach(ad => {
            const type = ad.type || 'Ukjent';
            counts[type] = (counts[type] || 0) + 1;
          });
          setTypeCounts(counts);
        }
      } catch (err) {
        console.error('Error fetching ad stats:', err);
        setErrorMsg('Kunne ikke hente statistikk.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdStats();
  }, [userId, supabase]);

  // Vis beskjed dersom brukeren ikke er innlogget
  if (!user) {
    return (
      <Dashboard>
        <h1>Statistikk</h1>
        <p>Du må være innlogget for å se denne siden.</p>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <h1>Statistikk</h1>

      {loading ? (
        <p>Laster data...</p>
      ) : errorMsg ? (
        <p style={{ color: 'red' }}>{errorMsg}</p>
      ) : totalAds !== null && totalAds === 0 ? (
        <p>Du har ingen annonser enda.</p>
      ) : (
        // Vis statistikk dersom data er klar
        <div>
          <p>Antall annonser: <strong>{totalAds}</strong></p>
          <p>Fordeling per annonsetype:</p>
          <ul>
            {Object.entries(typeCounts).map(([type, count]) => (
              <li key={type}>
                {type}: <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Dashboard>
  );
};

export default StatistikkPage;
