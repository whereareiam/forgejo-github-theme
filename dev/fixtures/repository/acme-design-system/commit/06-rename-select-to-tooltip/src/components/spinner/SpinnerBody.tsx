import type { ReactNode } from "react";
import { tokens } from "../../tokens/spinner";

export interface SpinnerBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SpinnerBody: part of the spinner component. */
export function SpinnerBody({ children, muted = false }: SpinnerBodyProps) {
  return (
    <div
      className="spinner-body"
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
