export default function SuggestionBox({
  suggestion,
  onAccept,
}: {
  suggestion: string;
  onAccept: () => void;
}) {
  return (
    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
      <p className="mb-4 text-sm text-blue-900">{suggestion}</p>
      <button
        onClick={onAccept}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Bruk forslaget
      </button>
    </div>
  );
}
