import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";
import Layout from "@/components/Layout";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  const isAdmin = router.pathname.startsWith("/admin");
  const isForside = router.pathname === "/";

  const content = <Component {...pageProps} />;

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      {isAdmin ? (
        <AdminLayout>{content}</AdminLayout>
      ) : isForside ? (
        content
      ) : (
        <Layout>{content}</Layout>
      )}
    </SessionContextProvider>
  );
}
