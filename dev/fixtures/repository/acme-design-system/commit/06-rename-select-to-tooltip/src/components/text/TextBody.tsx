import type { ReactNode } from "react";
import { tokens } from "../../tokens/text";

export interface TextBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TextBody: part of the text component. */
export function TextBody({ children, muted = false }: TextBodyProps) {
  return (
    <div
      className="text-body"
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
