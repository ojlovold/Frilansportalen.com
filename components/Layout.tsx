// components/Layout.tsx

import { useRouter } from "next/router";
import { ReactNode } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import AccessibilityPanel from "@/components/AccessibilityPanel";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  if (router.asPath === "/admin/logginn") return <>{children}</>;

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      {visPiler && (
        <div className="absolute top-6 left-6 z-50">
          <TilbakeKnapp retning="venstre" className="w-12 h-12" />
        </div>
      )}

      {visPiler && (
        <div className="absolute top-6 right-6 z-50">
          <TilbakeKnapp retning="høyre" className="w-12 h-12" />
        </div>
      )}

      <AccessibilityPanel />

      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
