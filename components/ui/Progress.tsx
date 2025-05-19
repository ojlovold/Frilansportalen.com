// components/ui/Progress.tsx
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}
        {...props}
      >
        <div
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
