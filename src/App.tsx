import { ControlPage } from "./pages/ControlPage";
import { LivePage } from "./pages/LivePage";
import { StandbyPage } from "./pages/StandbyPage";

export function App() {
  const path = window.location.pathname;

  if (path.startsWith("/control")) {
    return <ControlPage />;
  }

  if (path.startsWith("/standby")) {
    return <StandbyPage />;
  }

  return <LivePage />;
}
