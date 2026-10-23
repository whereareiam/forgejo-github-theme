import type { ReactNode } from "react";
import { tokens } from "../../tokens/actions";

export interface ActionsGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ActionsGroup: part of the actions component. */
export function ActionsGroup({ children, muted = false }: ActionsGroupProps) {
  return (
    <div
      className="actions-group"
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
