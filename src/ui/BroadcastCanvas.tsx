import type { ReactNode } from "react";

export function BroadcastCanvas({ children }: { children: ReactNode }) {
  return <div className="broadcast-canvas">{children}</div>;
}
