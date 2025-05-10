export default function ReportBox({ onSend }: { onSend: () => void }) {
  return (
    <div className="bg-white border border-black rounded-lg p-4">
      <textarea
        placeholder="Skriv melding..."
        className="w-full h-32 p-2 border rounded resize-none text-sm"
      ></textarea>
      <button
        onClick={onSend}
        className="bg-black text-white px-4 py-2 mt-3 rounded hover:bg-gray-800 text-sm"
      >
        Send melding
      </button>
    </div>
  );
}
