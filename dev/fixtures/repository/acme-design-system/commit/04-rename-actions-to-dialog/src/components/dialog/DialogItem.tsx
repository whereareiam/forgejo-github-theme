import type { ReactNode } from "react";
import { tokens } from "../../tokens/dialog";

export interface DialogItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DialogItem: part of the dialog component. */
export function DialogItem({ children, muted = false }: DialogItemProps) {
  return (
    <div
      className="dialog-item"
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
