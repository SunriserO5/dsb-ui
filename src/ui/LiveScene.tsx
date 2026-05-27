import { useEffect, useState } from "react";
import { caerulaAssets } from "../theme/assets";
import type { LiveState } from "../types";
import { formatTimer, getTimerMs } from "../utils/timer";

type LiveSceneProps = {
  state: LiveState;
  active: boolean;
};

export function LiveScene({ state, active }: LiveSceneProps) {
  const [now, setNow] = useState(Date.now());
  const timerText = formatTimer(getTimerMs(state.match.supportTimer, now));

  useEffect(() => {
    if (!state.match.supportTimer.running) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 33);
    return () => window.clearInterval(interval);
  }, [state.match.supportTimer.running, state.match.supportTimer.startedAt]);

  return (
    <section className={`scene-layer live-scene ${active ? "active" : ""}`}>
      <img className="scene-bg scene-bg-soft" src={caerulaAssets.bgSoft} alt="" />
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
            <span>{state.player.avatarLabel}</span>
          </div>
          <strong>{state.player.name}</strong>
        </div>

        <div className="sidebar-section-title">所属队伍</div>
        <div className="team-name">{state.player.team || state.team.name}</div>

        <div className="team-list">
          {state.team.members.map((member, index) => (
            <div className="team-slot" key={`${member.label}-${index}`}>
              <span>{member.label}</span>
              <strong>{member.value}</strong>
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
