import type { ReactNode } from "react";
import { tokens } from "../../tokens/banner";

export interface BannerTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BannerTrigger: part of the banner component. */
export function BannerTrigger({ children, muted = false }: BannerTriggerProps) {
  return (
    <div
      className="banner-trigger"
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
