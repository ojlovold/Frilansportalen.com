export default function ErrorBox({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-800 rounded-lg p-4 mb-6 relative">
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-xs text-red-600 hover:underline"
      >
        Lukk
      </button>
    </div>
  );
}
