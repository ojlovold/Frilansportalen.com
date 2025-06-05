// components/Layout.tsx

import { useRouter } from "next/router";
import { ReactNode } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  if (router.asPath === "/admin/logginn") return <>{children}</>;

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      {/* Logg inn-knapp øverst til høyre */}
      <div className="absolute top-4 right-24 z-50 flex items-center gap-4">
  <Link href="/login" className="hover:opacity-80">
    <img
      src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
      alt="Logg inn"
      className="h-8 w-auto"
    />
  </Link>
  <button title="Talehjelp" className="hover:opacity-80">
    <img
      src="/A_3D-rendered_white_icon_in_Norse_or_Viking_style_.png"
      alt="Talehjelp"
      className="h-8 w-auto"
    />
  </button>
  <button title="Språkvalg" className="hover:opacity-80">
    <img
      src="/A_2D_digital_image_features_a_three-dimensional_wh.png"
      alt="Språk"
      className="h-8 w-auto"
    />
  </button>
</div>

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

      

      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
