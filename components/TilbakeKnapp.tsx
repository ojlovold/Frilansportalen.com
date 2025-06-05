import { useRouter } from "next/router";

type Retning = "venstre" | "høyre";

export default function TilbakeKnapp({ retning = "venstre", className = "" }: { retning?: Retning; className?: string }) {
  const router = useRouter();

  const bildeSrc =
    retning === "høyre"
      ? "/A_2D_digital_rendering_features_a_three-dimensiona.png"
      : "/A_3D-rendered_digital_image_of_a_left-facing_arrow.png";

  const handleClick = () => {
    if (retning === "høyre") {
      window.history.forward();
    } else {
      router.back();
    }
  };

  return (
    <img
      src={bildeSrc}
      alt={`Pil ${retning}`}
      className={`w-12 h-12 cursor-pointer hover:opacity-80 ${className}`}
      onClick={handleClick}
    />
  );
}
