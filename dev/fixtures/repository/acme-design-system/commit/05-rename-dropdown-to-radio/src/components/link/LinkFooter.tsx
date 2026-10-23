import type { ReactNode } from "react";
import { tokens } from "../../tokens/link";

export interface LinkFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LinkFooter: part of the link component. */
export function LinkFooter({ children, muted = false }: LinkFooterProps) {
  return (
    <div
      className="link-footer"
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
