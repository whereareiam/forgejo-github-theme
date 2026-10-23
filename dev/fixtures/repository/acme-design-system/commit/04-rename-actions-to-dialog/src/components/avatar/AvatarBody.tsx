import type { ReactNode } from "react";
import { tokens } from "../../tokens/avatar";

export interface AvatarBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** AvatarBody: part of the avatar component. */
export function AvatarBody({ children, muted = false }: AvatarBodyProps) {
  return (
    <div
      className="avatar-body"
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
