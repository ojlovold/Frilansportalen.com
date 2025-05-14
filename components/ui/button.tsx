import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-colors",
          variant === "default"
            ? "bg-black text-white hover:bg-gray-800"
            : "border border-black text-black hover:bg-black hover:text-white",
          className
        )}
      />
    );
  }
);

Button.displayName = "Button";
