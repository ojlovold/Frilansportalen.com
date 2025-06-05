import { useRouter } from "next/router";

export default function TilbakeKnapp({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <img
      src="/A_3D-rendered_digital_image_of_a_left-facing_arrow.png"
      alt="Tilbake"
      className={`w-12 h-12 cursor-pointer hover:opacity-80 ${className}`}
      onClick={() => router.back()}
    />
  );
}
