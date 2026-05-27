import type { LiveState } from "./types";

export const defaultState: LiveState = {
  theme: "caerulaarbor",
  scene: "live",
  updatedAt: new Date().toISOString(),
  match: {
    eventTitle: "水月与深蓝之树",
    roundTitle: "赛事表演赛",
    caster: "本场解说",
    supportTimer: {
      baseMs: 0,
      startedAt: null,
      running: false,
    },
    standbyTimer: {
      baseMs: 0,
      startedAt: null,
      running: false,
    },
    standbyPrompt: "请选手准备，导播确认画面后开始。",
  },
  player: {
    name: "当前选手",
    team: "所属队伍",
    avatarLabel: "MIZUKI",
  },
  team: {
    name: "所属队伍",
    members: [
      { label: "开局干员", value: "待确认" },
      { label: "开局分队", value: "待确认" },
    ],
  },
};
