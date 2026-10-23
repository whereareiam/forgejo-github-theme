import type { ReactNode } from "react";
import { tokens } from "../../tokens/navigation";

export interface NavigationLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** NavigationLabel: part of the navigation component. */
export function NavigationLabel({ children, muted = false }: NavigationLabelProps) {
  return (
    <div
      className="navigation-label"
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
