import type { ReactNode } from "react";
import { tokens } from "../../tokens/actions";

export interface ActionsItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ActionsItem: part of the actions component. */
export function ActionsItem({ children, muted = false }: ActionsItemProps) {
  return (
    <div
      className="actions-item"
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
