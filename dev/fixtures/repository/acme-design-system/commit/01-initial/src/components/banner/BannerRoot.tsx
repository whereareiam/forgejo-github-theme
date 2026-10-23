import type { ReactNode } from "react";

export interface BannerRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BannerRoot: part of the banner component. */
export function BannerRoot({ children, muted = false }: BannerRootProps) {
  return (
    <div
      className="banner-root"
      style={{
        color: muted ? "var(--color-fg-muted)" : "var(--color-fg-default)",
        background: muted ? "var(--color-canvas-muted)" : "var(--color-canvas-default)",
        borderColor: muted ? "var(--color-border-muted)" : "var(--color-border-default)",
        padding: "var(--size-spacing-4) var(--size-spacing-8)",
        gap: "var(--size-spacing-2)",
        borderRadius: "var(--size-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}
