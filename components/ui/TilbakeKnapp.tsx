// components/ui/TilbakeKnapp.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TilbakeKnapp() {
  return (
    <div className="mb-6">
      <Link href="/admin" className="inline-flex items-center text-sm text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Tilbake til admin
      </Link>
    </div>
  );
}
