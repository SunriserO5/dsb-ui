import { type CSSProperties, useEffect, useState } from "react";
import { getTheme } from "../theme/assets";
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
  const theme = getTheme(state.theme);
  const themeStyle = {
    "--theme-accent": theme.accent,
    "--theme-accent-soft": theme.accentSoft,
    "--theme-line": theme.line,
    "--theme-panel": theme.panel,
    "--theme-panel-deep": theme.panelDeep,
    "--theme-gold": theme.gold,
    "--theme-display-font": theme.displayFont,
  } as CSSProperties;

  useEffect(() => {
    if (!state.match.standbyTimer.running) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 33);
    return () => window.clearInterval(interval);
  }, [state.match.standbyTimer.running, state.match.standbyTimer.startedAt]);

  return (
    <section
      className={`scene-layer standby-scene themed-scene ${theme.className} ${active ? "active" : ""}`}
      style={themeStyle}
    >
      <img className="standby-bg" src={theme.standbyBackground} alt="" />
      {theme.standbyDecor ? (
        <img className="standby-decor" src={theme.standbyDecor} alt="" aria-hidden="true" />
      ) : null}
      <div className="standby-vignette" />
      <img className="theme-icon standby-theme-icon" src={theme.mark} alt="" />
      <img
        className="standby-ornament"
        src={theme.accentOrnament ?? theme.mark}
        alt=""
        aria-hidden="true"
      />
      <div className="standby-copy">
        {theme.standbyTitle ? (
          <img className="standby-title-art" src={theme.standbyTitle} alt="" />
        ) : (
          <p>{state.match.roundTitle}</p>
        )}
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
