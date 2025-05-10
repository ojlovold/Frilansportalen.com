export default function ErrorBox({ feil }: { feil: string }) {
  if (!feil) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded mb-4">
      <strong>Oops!</strong> {feil}
    </div>
  );
}
