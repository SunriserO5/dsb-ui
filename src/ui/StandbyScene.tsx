import { caerulaAssets } from "../theme/assets";
import type { LiveState } from "../types";

type StandbySceneProps = {
  state: LiveState;
  active: boolean;
};

export function StandbyScene({ state, active }: StandbySceneProps) {
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
        <i />
        <span>{state.match.standbyPrompt}</span>
      </div>
    </section>
  );
}
