export type Scene = "live" | "standby";

export type ThemeId =
  | "caerulaarbor"
  | "crimsonsolitaire"
  | "furnacesidefables"
  | "gardenofgrotesqueries"
  | "samiexpedition";

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
  theme: ThemeId;
  scene: Scene;
  updatedAt: string;
  match: {
    eventTitle: string;
    roundTitle: string;
    caster: string;
    supportTimer: SupportTimer;
    standbyTimer: SupportTimer;
    standbyPrompt: string;
  };
  player: {
    name: string;
    team: string;
    avatarLabel: string;
    avatarUrl: string;
  };
  team: {
    name: string;
    avatarUrl: string;
    openingOperatorAvatarUrl: string;
    members: TeamMember[];
  };
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
