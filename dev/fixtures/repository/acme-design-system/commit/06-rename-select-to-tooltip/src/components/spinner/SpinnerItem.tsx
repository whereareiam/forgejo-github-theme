import type { ReactNode } from "react";
import { tokens } from "../../tokens/spinner";

export interface SpinnerItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SpinnerItem: part of the spinner component. */
export function SpinnerItem({ children, muted = false }: SpinnerItemProps) {
  return (
    <div
      className="spinner-item"
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
