import type { ReactNode } from "react";
import { tokens } from "../../tokens/toast";

export interface ToastBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastBody: part of the toast component. */
export function ToastBody({ children, muted = false }: ToastBodyProps) {
  return (
    <div
      className="toast-body"
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
