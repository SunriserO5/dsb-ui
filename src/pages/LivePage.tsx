import { BroadcastCanvas } from "../ui/BroadcastCanvas";
import { LiveScene } from "../ui/LiveScene";
import { StandbyScene } from "../ui/StandbyScene";
import { useLiveState } from "../hooks/useLiveState";

export function LivePage() {
  const { state } = useLiveState();

  return (
    <main className="capture-page" aria-label="直播输出">
      <BroadcastCanvas>
        <LiveScene state={state} active={state.scene === "live"} />
        <StandbyScene state={state} active={state.scene === "standby"} />
      </BroadcastCanvas>
    </main>
  );
}
