// components/PremiumBox.tsx

export default function PremiumBox() {
  return (
    <div className="relative bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-yellow-950 border-4 border-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.8)] rounded-2xl p-6 max-w-xl mx-auto text-center animate-pulse">
      <h2 className="text-2xl font-extrabold mb-2 tracking-wide">Din gullbillett venter!</h2>
      <p className="text-sm mb-4 text-yellow-900">
        Få tilgang til alt Frilansportalen tilbyr: AI-assistenter, eksport, ekstra funksjoner og premiumprioritet.
      </p>
      <button className="mt-4 bg-yellow-800 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full transition">
        Oppgrader til Premium
      </button>
    </div>
  );
}
