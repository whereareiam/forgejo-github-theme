import type { ReactNode } from "react";
import { tokens } from "../../tokens/link";

export interface LinkItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LinkItem: part of the link component. */
export function LinkItem({ children, muted = false }: LinkItemProps) {
  return (
    <div
      className="link-item"
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
