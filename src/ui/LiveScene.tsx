import { type CSSProperties, useEffect, useState } from "react";
import { getTheme } from "../theme/assets";
import type { LiveState } from "../types";
import { formatTimer, getTimerMs } from "../utils/timer";

type LiveSceneProps = {
  state: LiveState;
  active: boolean;
};

export function LiveScene({ state, active }: LiveSceneProps) {
  const [now, setNow] = useState(Date.now());
  const timerText = formatTimer(getTimerMs(state.match.supportTimer, now));
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
    if (!state.match.supportTimer.running) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 33);
    return () => window.clearInterval(interval);
  }, [state.match.supportTimer.running, state.match.supportTimer.startedAt]);

  return (
    <section
      className={`scene-layer live-scene themed-scene ${theme.className} ${active ? "active" : ""}`}
      style={themeStyle}
    >
      <img className="scene-bg scene-bg-soft" src={theme.liveBackground} alt="" />
      <img className="theme-icon live-theme-icon" src={theme.mark} alt="" />
      <div className="screen-frame" aria-hidden="true">
        <div className="screen-corner top-left" />
        <div className="screen-corner top-right" />
        <div className="screen-corner bottom-left" />
        <div className="screen-corner bottom-right" />
        <div className="screen-border top" />
        <div className="screen-border bottom" />
        <div className="screen-border left" />
        <div className="screen-border right" />
      </div>

      <aside className="player-sidebar">
        <div className="sidebar-title">当前选手</div>
        <div className="player-card">
          <div className="avatar-window">
            {state.player.avatarUrl ? (
              <img src={state.player.avatarUrl} alt="" />
            ) : (
              <span>{state.player.avatarLabel}</span>
            )}
          </div>
          <strong>{state.player.name}</strong>
        </div>

        <div className="sidebar-section-title">所属队伍</div>
        <div className="team-identity">
          <div className="team-avatar">
            {state.team.avatarUrl ? <img src={state.team.avatarUrl} alt="" /> : <span />}
          </div>
          <div className="team-name">{state.player.team || state.team.name}</div>
        </div>

        <div className="team-list">
          {state.team.members.map((member, index) => (
            <div className="team-slot" key={`${member.label}-${index}`}>
              <span>{member.label}</span>
              {member.label.includes("开局干员") && state.team.openingOperatorAvatarUrl ? (
                <div className="team-slot-visual">
                  <img src={state.team.openingOperatorAvatarUrl} alt="" />
                  <strong>{member.value}</strong>
                </div>
              ) : (
                <strong>{member.value}</strong>
              )}
            </div>
          ))}
        </div>
      </aside>

      <footer className="lower-third">
        <div className="lower-block caster">
          <span>本场解说</span>
          <strong>{state.match.caster}</strong>
        </div>
        <div className="lower-block time">
          <span>支援倒计时</span>
          <strong>{timerText}</strong>
        </div>
      </footer>
    </section>
  );
}
