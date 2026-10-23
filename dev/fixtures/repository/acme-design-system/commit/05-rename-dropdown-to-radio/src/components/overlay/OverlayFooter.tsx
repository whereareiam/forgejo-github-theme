import type { ReactNode } from "react";
import { tokens } from "../../tokens/overlay";

export interface OverlayFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** OverlayFooter: part of the overlay component. */
export function OverlayFooter({ children, muted = false }: OverlayFooterProps) {
  return (
    <div
      className="overlay-footer"
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
