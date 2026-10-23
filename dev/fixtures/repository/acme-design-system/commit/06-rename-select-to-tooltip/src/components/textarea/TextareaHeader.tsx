import type { ReactNode } from "react";
import { tokens } from "../../tokens/textarea";

export interface TextareaHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TextareaHeader: part of the textarea component. */
export function TextareaHeader({ children, muted = false }: TextareaHeaderProps) {
  return (
    <div
      className="textarea-header"
      style={{
        color: muted ? "var(--ds-fgColor-muted)" : "var(--ds-fgColor-default)",
        background: muted ? "var(--ds-bgColor-muted)" : "var(--ds-bgColor-default)",
        borderColor: muted ? "var(--ds-borderColor-muted)" : "var(--ds-borderColor-default)",
        padding: "var(--ds-space-4) var(--ds-space-8)",
        gap: "var(--ds-space-2)",
        borderRadius: "var(--ds-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}
