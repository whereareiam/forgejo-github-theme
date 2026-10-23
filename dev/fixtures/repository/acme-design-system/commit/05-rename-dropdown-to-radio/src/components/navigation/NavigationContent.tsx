import type { ReactNode } from "react";
import { tokens } from "../../tokens/navigation";

export interface NavigationContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** NavigationContent: part of the navigation component. */
export function NavigationContent({ children, muted = false }: NavigationContentProps) {
  return (
    <div
      className="navigation-content"
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
