import type { ReactNode } from "react";
import { tokens } from "../../tokens/banner";

export interface BannerIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BannerIcon: part of the banner component. */
export function BannerIcon({ children, muted = false }: BannerIconProps) {
  return (
    <div
      className="banner-icon"
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
