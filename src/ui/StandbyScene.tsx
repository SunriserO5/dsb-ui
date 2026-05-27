import { useEffect, useState } from "react";
import { caerulaAssets } from "../theme/assets";
import type { LiveState } from "../types";
import { formatTimer, getTimerMs } from "../utils/timer";

type StandbySceneProps = {
  state: LiveState;
  active: boolean;
};

export function StandbyScene({ state, active }: StandbySceneProps) {
  const [now, setNow] = useState(Date.now());
  const standbyMs = getTimerMs(state.match.standbyTimer, now);
  const hasStandbyTimer = state.match.standbyTimer.running || standbyMs > 0;

  useEffect(() => {
    if (!state.match.standbyTimer.running) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 33);
    return () => window.clearInterval(interval);
  }, [state.match.standbyTimer.running, state.match.standbyTimer.startedAt]);

  return (
    <section className={`scene-layer standby-scene ${active ? "active" : ""}`}>
      <img className="standby-bg" src={caerulaAssets.pause} alt="" />
      <div className="standby-vignette" />
      <div className="standby-copy">
        <p>{state.match.roundTitle}</p>
        <h1>PLEASE WAIT</h1>
        <strong>直播待机中</strong>
        <span>{state.match.eventTitle}</span>
      </div>
      <div className="standby-signal">
        <span>{state.match.standbyPrompt}</span>
        {hasStandbyTimer ? <strong>{formatTimer(standbyMs)}</strong> : null}
      </div>
    </section>
  );
}
