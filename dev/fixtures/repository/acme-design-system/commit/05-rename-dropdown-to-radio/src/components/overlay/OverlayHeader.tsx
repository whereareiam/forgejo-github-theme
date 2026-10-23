import type { ReactNode } from "react";
import { tokens } from "../../tokens/overlay";

export interface OverlayHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** OverlayHeader: part of the overlay component. */
export function OverlayHeader({ children, muted = false }: OverlayHeaderProps) {
  return (
    <div
      className="overlay-header"
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
