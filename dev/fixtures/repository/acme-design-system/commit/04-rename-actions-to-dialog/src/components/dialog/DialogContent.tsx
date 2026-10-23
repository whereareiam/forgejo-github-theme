import type { ReactNode } from "react";
import { tokens } from "../../tokens/dialog";

export interface DialogContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DialogContent: part of the dialog component. */
export function DialogContent({ children, muted = false }: DialogContentProps) {
  return (
    <div
      className="dialog-content"
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
