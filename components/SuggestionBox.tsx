export default function SuggestionBox({ forslag, onAccept }: { forslag: string, onAccept: () => void }) {
  if (!forslag) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 text-sm px-4 py-3 rounded mb-6">
      <p className="mb-2"><strong>Forbedringsforslag:</strong> {forslag}</p>
      <button
        onClick={onAccept}
        className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
      >
        Bruk forslaget
      </button>
    </div>
  );
}
