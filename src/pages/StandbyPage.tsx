import { useEffect, useRef, useState } from "react";
import { BroadcastCanvas } from "../ui/BroadcastCanvas";
import { StandbyScene } from "../ui/StandbyScene";
import { useLiveState } from "../hooks/useLiveState";
import type { LiveState } from "../types";
import { getTimerMs } from "../utils/timer";

export function StandbyPage() {
  const { state, updateState } = useLiveState();
  const previousStateRef = useRef<LiveState>(state);
  const clearGhostRef = useRef<number | null>(null);
  const [ghostState, setGhostState] = useState<LiveState | null>(null);

  useEffect(() => {
    const previousState = previousStateRef.current;
    if (previousState.theme !== state.theme) {
      setGhostState(previousState);

      if (clearGhostRef.current) {
        window.clearTimeout(clearGhostRef.current);
      }

      clearGhostRef.current = window.setTimeout(() => {
        setGhostState(null);
        clearGhostRef.current = null;
      }, 380);
    }

    previousStateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      if (clearGhostRef.current) {
        window.clearTimeout(clearGhostRef.current);
      }
    };
  }, []);

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
        {ghostState ? (
          <div className="theme-transition-ghost" aria-hidden="true">
            <StandbyScene state={ghostState} active />
          </div>
        ) : null}
      </BroadcastCanvas>
    </main>
  );
}
