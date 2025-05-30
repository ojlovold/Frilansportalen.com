// components/ui/Label.tsx
import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={`text-sm font-medium ${className}`} {...props} />
));

Label.displayName = "Label";

export { Label };
