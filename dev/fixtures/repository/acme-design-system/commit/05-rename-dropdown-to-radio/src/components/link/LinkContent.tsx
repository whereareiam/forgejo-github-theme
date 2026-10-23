import type { ReactNode } from "react";
import { tokens } from "../../tokens/link";

export interface LinkContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LinkContent: part of the link component. */
export function LinkContent({ children, muted = false }: LinkContentProps) {
  return (
    <div
      className="link-content"
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
