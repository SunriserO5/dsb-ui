import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const statePath = resolve(__dirname, "../data/live-state.json");
const port = Number(process.env.STATE_SERVER_PORT || 8787);

const defaultState = {
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

let state = defaultState;
let saveTimer;

async function loadState() {
  try {
    const file = await readFile(statePath, "utf8");
    state = { ...defaultState, ...JSON.parse(file) };
  } catch (error) {
    console.warn("[state] using default state:", error.message);
  }
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
    } catch (error) {
      console.error("[state] failed to save:", error);
    }
  }, 200);
}

function broadcast(payload) {
  const message = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

function normalizePatch(nextState) {
  const nextMatch = { ...defaultState.match, ...nextState.match };
  if (!nextMatch.supportTimer) {
    nextMatch.supportTimer = defaultState.match.supportTimer;
  } else if (typeof nextMatch.supportTimer.baseMs !== "number") {
    nextMatch.supportTimer = {
      baseMs: Math.max(0, Number(nextMatch.supportTimer.baseSeconds || 0) * 1000),
      startedAt: nextMatch.supportTimer.startedAt ?? null,
      running: Boolean(nextMatch.supportTimer.running),
    };
  }

  return {
    ...defaultState,
    ...nextState,
    match: nextMatch,
    player: { ...defaultState.player, ...nextState.player },
    team: {
      ...defaultState.team,
      ...nextState.team,
      members: Array.isArray(nextState.team?.members)
        ? nextState.team.members.slice(0, 8)
        : defaultState.team.members,
    },
    updatedAt: new Date().toISOString(),
  };
}

const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, clients: wss.clients.size }));
    return;
  }

  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "state", state }));

  socket.on("message", (raw) => {
    try {
      const message = JSON.parse(raw.toString());
      if (message.type !== "update" || !message.state) {
        return;
      }

      state = normalizePatch(message.state);
      queueSave();
      broadcast({ type: "state", state });
    } catch (error) {
      socket.send(JSON.stringify({ type: "error", message: error.message }));
    }
  });
});

await loadState();

server.listen(port, () => {
  console.log(`[state] ws://localhost:${port}`);
});
