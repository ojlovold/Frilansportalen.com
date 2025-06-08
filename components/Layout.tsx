import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import Link from "next/link";

const getFlagg = (lang: string) => {
  const landkode = lang.split("-")[1]?.toLowerCase() || lang.slice(-2).toLowerCase();
  return String.fromCodePoint(...[...landkode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
};

const standardSprak = [
  "no-NO", "en-US", "en-GB", "sv-SE", "da-DK", "de-DE", "fr-FR",
  "es-ES", "it-IT", "pt-PT", "nl-NL", "fi-FI", "pl-PL", "tr-TR",
  "cs-CZ", "el-GR", "hu-HU", "ro-RO", "sk-SK", "sl-SI", "bg-BG",
  "ru-RU", "ja-JP", "ko-KR", "zh-CN", "ar-SA", "he-IL", "th-TH"
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visSprak, setVisSprak] = useState(false);
  const [visTale, setVisTale] = useState(false);
  const [sprak, setSprak] = useState("no-NO");
  const [leser, setLeser] = useState(false);

  useEffect(() => {
    const lagret = localStorage.getItem("sprak");
    if (lagret) setSprak(lagret);
  }, []);

  const byttSprak = (kode: string) => {
    localStorage.setItem("sprak", kode);
    setSprak(kode);
    router.push(router.pathname, router.asPath, { locale: kode });
    setVisSprak(false);
  };

  const lesOpp = () => {
    const uttale = new SpeechSynthesisUtterance(document.body.innerText);
    uttale.lang = sprak;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(uttale);
    setLeser(true);
    uttale.onend = () => setLeser(false);
  };

  const stoppLesing = () => {
    window.speechSynthesis.cancel();
    setLeser(false);
  };

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      <div className="fixed top-4 right-28 z-[9999] flex flex-row-reverse items-center gap-6">
        <Link href="/login">
          <img
            src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
            alt="Logg inn"
            className="h-12 w-12 object-contain transition-transform active:scale-90 hover:opacity-80"
          />
        </Link>

        <button onClick={() => setVisTale((v) => !v)} aria-label="Talehjelp">
          <img
            src="/A_3D-rendered_white_icon_in_Norse_or_Viking_style_.png"
            alt="Talehjelp"
            className="h-12 w-12 object-contain transition-transform active:scale-90 hover:opacity-80"
          />
        </button>

        <button onClick={() => setVisSprak((v) => !v)} aria-label="Språkvalg">
          <img
            src="/A_2D_digital_image_features_a_three-dimensional_wh.png"
            alt="Språkvalg"
            className="h-12 w-12 object-contain transition-transform active:scale-90 hover:opacity-80"
          />
        </button>
      </div>

      {visSprak && (
        <div className="fixed top-20 right-6 z-[9999] bg-black text-yellow-300 p-4 rounded shadow-xl text-sm max-h-[50vh] overflow-y-auto space-y-1">
          <p className="font-bold mb-2">Velg språk:</p>
          {standardSprak.map((kode) => (
            <button
              key={kode}
              onClick={() => byttSprak(kode)}
              className="block text-left w-full hover:text-yellow-100"
            >
              {getFlagg(kode)} {kode}
            </button>
          ))}
        </div>
      )}

      {visTale && (
        <div className="fixed top-20 right-6 z-[9999] bg-black text-yellow-300 p-4 rounded shadow-xl text-sm space-y-2">
          <p className="font-bold mb-2">Talehjelp:</p>
          {leser ? (
            <button onClick={stoppLesing}>⏹️ Stopp</button>
          ) : (
            <button onClick={lesOpp}>🔊 Les opp</button>
          )}
        </div>
      )}

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

      <main className="p-4 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
