import type { ReactNode } from "react";
import { tokens } from "../../tokens/toast";

export interface ToastFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastFooter: part of the toast component. */
export function ToastFooter({ children, muted = false }: ToastFooterProps) {
  return (
    <div
      className="toast-footer"
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
