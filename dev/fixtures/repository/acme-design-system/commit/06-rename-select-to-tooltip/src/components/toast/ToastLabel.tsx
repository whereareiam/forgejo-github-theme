import type { ReactNode } from "react";
import { tokens } from "../../tokens/toast";

export interface ToastLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastLabel: part of the toast component. */
export function ToastLabel({ children, muted = false }: ToastLabelProps) {
  return (
    <div
      className="toast-label"
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
