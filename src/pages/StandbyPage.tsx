import { BroadcastCanvas } from "../ui/BroadcastCanvas";
import { StandbyScene } from "../ui/StandbyScene";
import { useLiveState } from "../hooks/useLiveState";

export function StandbyPage() {
  const { state } = useLiveState();

  return (
    <main className="capture-page" aria-label="待机输出">
      <BroadcastCanvas>
        <StandbyScene state={state} active />
      </BroadcastCanvas>
    </main>
  );
}
