import type { ReactNode } from "react";
import { tokens } from "../../tokens/dialog";

export interface DialogLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DialogLabel: part of the dialog component. */
export function DialogLabel({ children, muted = false }: DialogLabelProps) {
  return (
    <div
      className="dialog-label"
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
