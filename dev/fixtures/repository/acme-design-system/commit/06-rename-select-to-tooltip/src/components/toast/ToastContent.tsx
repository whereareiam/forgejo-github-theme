import type { ReactNode } from "react";
import { tokens } from "../../tokens/toast";

export interface ToastContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastContent: part of the toast component. */
export function ToastContent({ children, muted = false }: ToastContentProps) {
  return (
    <div
      className="toast-content"
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
