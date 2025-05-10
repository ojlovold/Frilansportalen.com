import { useRouter } from "next/router";

export default function TilbakeKnapp() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-sm underline text-blue-600 hover:text-blue-800"
    >
      ← Tilbake
    </button>
  );
}
