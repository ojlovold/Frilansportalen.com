import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full rounded border border-black bg-white px-3 py-2 text-sm shadow placeholder:text-gray-500 focus:outline-none",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
