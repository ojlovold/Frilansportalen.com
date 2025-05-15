import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full border border-black rounded p-2 bg-white text-black shadow-inner ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export { Textarea };
