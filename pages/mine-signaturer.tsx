// pages/mine-signaturer.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import supabase from '../lib/supabaseClient';

type Rad = {
  id: string;
  dokument_id: string;
  signatur: string;
  tidspunkt: string;
  url?: string | null;
};

export default function MineSignaturer() {
  const user = useUser();
  const [liste, setListe] = useState<Rad[]>([]);

  useEffect(() => {
    const hent = async () => {
      const brukerId = (user as any)?.id;
      if (!brukerId) return;

      const { data, error } = await supabase
        .from('signaturer')
        .select('*')
        .eq('bruker_id', brukerId)
        .order('tidspunkt', { ascending: false });

      if (error || !data) return;

      const medUrl = data.map((s) => {
        const path = `${brukerId}/${s.dokument_id}.pdf`;
        const { data: urlData } = supabase.storage
          .from('signerte-dokumenter')
          .getPublicUrl(path);
        return {
          ...s,
          url: urlData?.publicUrl || null,
        };
      });

      setListe(medUrl);
    };

    hent();
  }, [user]);

  return (
    <>
      <Head>
        <title>Mine signaturer | Frilansportalen</title>
        <meta name="description" content="Se hvilke dokumenter du har signert" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mine signaturer</h1>

        {liste.length === 0 ? (
          <p>Du har ikke signert noen dokumenter ennå.</p>
        ) : (
          <div className="space-y-4">
            {liste.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded shadow text-sm">
                <p><strong>Dokument:</strong> {s.dokument_id}</p>
                <p><strong>Signatur:</strong> {s.signatur}</p>
                <p className="text-gray-600">
                  {new Date(s.tidspunkt).toLocaleString('no-NO')}
                </p>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Last ned signert dokument
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
