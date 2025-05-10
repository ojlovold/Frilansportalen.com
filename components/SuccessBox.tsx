export default function SuccessBox({ melding }: { melding: string }) {
  if (!melding) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 text-sm px-4 py-2 rounded mb-4">
      <strong>OK!</strong> {melding}
    </div>
  );
}
