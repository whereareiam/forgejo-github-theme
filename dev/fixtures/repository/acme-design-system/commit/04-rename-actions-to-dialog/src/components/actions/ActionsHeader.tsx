import type { ReactNode } from "react";
import { tokens } from "../../tokens/actions";

export interface ActionsHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ActionsHeader: part of the actions component. */
export function ActionsHeader({ children, muted = false }: ActionsHeaderProps) {
  return (
    <div
      className="actions-header"
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
