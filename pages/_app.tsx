// pages/_app.tsx
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { LayoutProvider } from "@/context/LayoutContext";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";

const GlobalToolbar = dynamic(() => import("@/components/GlobalToolbar"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <LayoutProvider>
        {isAdmin ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <Layout>
            <GlobalToolbar />
            <Component {...pageProps} />
          </Layout>
        )}
      </LayoutProvider>
    </SessionContextProvider>
  );
}
