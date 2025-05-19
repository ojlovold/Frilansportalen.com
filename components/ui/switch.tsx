// components/ui/switch.tsx
import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors px-1 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`h-4 w-4 bg-white rounded-full transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
