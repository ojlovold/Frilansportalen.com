import { useEffect, useState } from "react";

export default function PopupAlert({ tekst }: { tekst: string }) {
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVis(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!vis) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg text-sm z-50">
      {tekst}
    </div>
  );
}
