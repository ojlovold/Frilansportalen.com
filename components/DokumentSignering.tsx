// pages/signering.tsx
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Layout from '@/components/Layout';
import DokumentSignering from '@/components/DokumentSignering';

export default function Signering() {
  const rawUser = useUser();
  const user = rawUser && typeof rawUser === 'object' && rawUser !== null && 'id' in rawUser
    ? (rawUser as User)
    : null;

  return (
    <Layout>
      <Head>
        <title>Signering | Frilansportalen</title>
      </Head>
      <div className="max-w-xl mx-auto py-10 text-black">
        <h1 className="text-3xl font-bold mb-6">Dokumentsignering</h1>

        {!user ? (
          <p>Du må være innlogget for å signere dokumenter.</p>
        ) : (
          <div className="space-y-10">
            <DokumentSignering brukerId={user.id} />
          </div>
        )}
      </div>
    </Layout>
  );
}
