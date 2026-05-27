import { useEffect } from "react";
import { BroadcastCanvas } from "../ui/BroadcastCanvas";
import { LiveScene } from "../ui/LiveScene";
import { StandbyScene } from "../ui/StandbyScene";
import { useLiveState } from "../hooks/useLiveState";
import { getTimerMs } from "../utils/timer";

export function LivePage() {
  const { state, updateState } = useLiveState();

  useEffect(() => {
    if (state.scene !== "standby" || !state.match.standbyTimer.running) {
      return;
    }

    const interval = window.setInterval(() => {
      if (getTimerMs(state.match.standbyTimer) > 0) {
        return;
      }

      updateState({
        ...state,
        scene: "live",
        match: {
          ...state.match,
          standbyTimer: {
            baseMs: 0,
            startedAt: null,
            running: false,
          },
        },
        updatedAt: new Date().toISOString(),
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [state, updateState]);

  return (
    <main className="capture-page" aria-label="直播输出">
      <BroadcastCanvas>
        <LiveScene state={state} active={state.scene === "live"} />
        <StandbyScene state={state} active={state.scene === "standby"} />
      </BroadcastCanvas>
    </main>
  );
}
