export type Scene = "live" | "standby";

export type TeamMember = {
  label: string;
  value: string;
};

export type SupportTimer = {
  baseMs: number;
  startedAt: string | null;
  running: boolean;
};

export type LiveState = {
  theme: "caerulaarbor";
  scene: Scene;
  updatedAt: string;
  match: {
    eventTitle: string;
    roundTitle: string;
    caster: string;
    supportTimer: SupportTimer;
    standbyPrompt: string;
  };
  player: {
    name: string;
    team: string;
    avatarLabel: string;
  };
  team: {
    name: string;
    members: TeamMember[];
  };
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
