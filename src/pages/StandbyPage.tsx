import { useEffect } from "react";
import { BroadcastCanvas } from "../ui/BroadcastCanvas";
import { StandbyScene } from "../ui/StandbyScene";
import { useLiveState } from "../hooks/useLiveState";
import { getTimerMs } from "../utils/timer";

export function StandbyPage() {
  const { state, updateState } = useLiveState();

  useEffect(() => {
    if (!state.match.standbyTimer.running) {
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
    <main className="capture-page" aria-label="待机输出">
      <BroadcastCanvas>
        <StandbyScene state={state} active />
      </BroadcastCanvas>
    </main>
  );
}
