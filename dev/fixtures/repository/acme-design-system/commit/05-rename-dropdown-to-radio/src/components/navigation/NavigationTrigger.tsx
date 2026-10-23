import type { ReactNode } from "react";
import { tokens } from "../../tokens/navigation";

export interface NavigationTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** NavigationTrigger: part of the navigation component. */
export function NavigationTrigger({ children, muted = false }: NavigationTriggerProps) {
  return (
    <div
      className="navigation-trigger"
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
